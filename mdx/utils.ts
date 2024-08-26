import path from "node:path";

import { generate } from "astring";
import { parse } from "meriyah";
import { remark } from "remark";
import strip from "strip-markdown";
import { is } from "unist-util-is";
import { visit } from "unist-util-visit";

import { getNextMarkdownPath } from "@/utils/path";
import { joinInAbsolute } from "@/utils/url";

import type { Program } from "estree-jsx";
import type { Element } from "hast";
import type { Node } from "unist";
import type { Test } from "unist-util-is";
import type { BuildVisitor, VisitorResult } from "unist-util-visit";

// 判断是否为 Element，可指定 tagName 和 properties 条件
export const isElement = <T extends Element = Element>(
    node?: Node,
    tagName?: string,
): node is T => {
    const test: Partial<Element> = { type: "element" };

    if (tagName) {
        test.tagName = tagName;
    }

    if (!is(node, test)) {
        return false;
    }

    return true;
};

export * from "unist-util-visit";
export const visitAsync = async <Tree extends Node, Check extends Test>(
    tree: Tree,
    check: Check,
    asyncVisitor: (...args: Parameters<BuildVisitor<Tree, Check>>) => Promise<void>,
    result: VisitorResult,
    // eslint-disable-next-line max-params
) => {
    const matches: Parameters<BuildVisitor<Tree, Check>>[] = [];
    visit(tree, check, (...args) => {
        matches.push(args);
        return result;
    });

    const promises = matches.map(match => asyncVisitor(...match));
    await Promise.all(promises);
};

export const jsToTree = (js: string) => parse(js, { module: true, jsx: true }) as Program;

export const treeToJs = (tree: Program) => generate(tree);

// 将 markdown 转换为纯文本
export const mdToText = async (md: string) => {
    const { value } = await remark()
        .use(strip, {
            remove: [
                [
                    // 处理 rehype-pretty-code 拓展的行内代码语法
                    "inlineCode",
                    ({ value, ...rest }) => ({
                        ...rest,
                        value: value.replace(/{:[a-zA-Z.-]+}$/, ""),
                    }),
                ],
            ],
        })
        .process(md);

    return value.toString().replaceAll("\n\n", "\n").trim();
};

export const getPermalink = (filepath: string) => {
    const relative = path.relative(getNextMarkdownPath(), filepath);
    return joinInAbsolute(path.dirname(relative));
};
