import { visit } from "unist-util-visit";

import type { Node } from "unist";
import type { Test } from "unist-util-is";
import type { BuildVisitor, VisitorResult } from "unist-util-visit";

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
