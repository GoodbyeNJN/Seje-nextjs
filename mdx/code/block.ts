import { addClassToHast } from "shikiji";

import { blogConfig } from "@/config";

import { codeToHast } from "./highlighter";
import { getCodeToHastOptions, getTheme, getThemeVarEntries } from "./theme";

import type { ThemeVar } from "./theme";
import type { PreElement, ShikijiCode, ShikijiPre, ShikijiRoot } from "./types";
import type { CodeToHastOptions, ShikijiTransformer } from "shikiji";

const parseRange = (range: string) =>
    range.split(",").flatMap(part => {
        const [start, end] = part
            .trim()
            .split("-")
            .map(n => parseInt(n, 10));

        if (R.isNullish(start)) {
            return [];
        }

        if (R.isNullish(end)) {
            return [start];
        }

        return R.range(start, end + 1);
    });

const parseMeta = (meta: string) => {
    let rest = meta;

    const [titleMatch, title = ""] = rest.match(/title="([^"]*)"/) || [];
    rest = titleMatch ? rest.replace(titleMatch, "") : rest;

    const [insertMatch, insertRange] = rest.match(/\+\+={([\d,-]+)}/) || [];
    rest = insertMatch ? rest.replace(insertMatch, "") : rest;
    const insertLines = insertRange ? parseRange(insertRange) : [];

    const [removeMatch, removeRange] = rest.match(/\-\-={([\d,-]+)}/) || [];
    rest = removeMatch ? rest.replace(removeMatch, "") : rest;
    const removeLines = removeRange ? parseRange(removeRange) : [];

    const [highlightMatch, highlightRange] = rest.match(/{([\d,-]+)}/) || [];
    rest = highlightMatch ? rest.replace(highlightMatch, "") : rest;
    const highlightLines = highlightRange ? parseRange(highlightRange) : [];

    const [langMatch, lang = ""] = rest.match(/(?:^)(.*?)(?:$|\s)/) || [];
    rest = langMatch ? rest.replace(langMatch, "") : "";

    rest = rest.trim();

    return { title, insertLines, removeLines, highlightLines, lang, rest };
};

const transformHighlightLine = (lines: number[]): ShikijiTransformer => ({
    name: "highlight-line",
    line(this, node, line) {
        if (lines.includes(line)) {
            addClassToHast(node, "highlighted");
            this.pre.properties["data-highlighted-lines"] = lines.join(",");
        }

        return node;
    },
});

const transformInsertLine = (lines: number[]): ShikijiTransformer => ({
    name: "insert-line",
    line(node, line) {
        if (lines.includes(line)) {
            addClassToHast(node, "inserted");
            this.pre.properties["data-inserted-lines"] = lines.join(",");
        }

        return node;
    },
});

const transformRemoveLine = (lines: number[]): ShikijiTransformer => ({
    name: "remove-line",
    line(node, line) {
        if (lines.includes(line)) {
            addClassToHast(node, "removed");
            this.pre.properties["data-removed-lines"] = lines.join(",");
        }

        return node;
    },
});

const getPreElementStyle = async (properties: ShikijiPre["properties"]) => {
    const { isSingleTheme, dark, light } = await getTheme();

    const vars: ThemeVar[] = ["", "bg"]; // empty string for fg
    blogConfig.code.showLineNumber && vars.push("index-fg");
    properties["data-title"] && vars.push("bar-bg", "title-fg", "title-bg");
    properties["data-highlighted-lines"] && vars.push("highlight-fg", "highlight-bg");
    properties["data-inserted-lines"] && vars.push("insert-bg");
    properties["data-removed-lines"] && vars.push("remove-bg");

    let style = "";
    if (isSingleTheme) {
        getThemeVarEntries(dark, vars).forEach(([k, v]) => {
            style += k ? `--shiki-${k}:${v};` : `--shiki:${v};`;
        });
    } else {
        getThemeVarEntries(light, vars).forEach(([k, v]) => {
            style += `--light-${k}:${v};`;
        });
        getThemeVarEntries(dark, vars).forEach(([k, v]) => {
            style += `--dark-${k}:${v};`;
        });
    }

    return style;
};

const highlightCode = async (code: string, options: CodeToHastOptions) => {
    const hasLanguage = R.isTruthy(options.lang);
    if (!hasLanguage) {
        options.lang = "txt";
    }

    const rootElement = codeToHast(code, options) as ShikijiRoot;
    const [preElement] = rootElement.children;
    const [codeElement] = preElement.children;

    preElement.children = codeElement.children as unknown as [ShikijiCode];

    preElement.properties.style = await getPreElementStyle(preElement.properties);
    preElement.properties.class = "shiki";
    delete preElement.properties.tabindex;

    if (blogConfig.code.showLineNumber) {
        preElement.properties["data-total-line"] = codeElement.children
            .filter(({ type }) => type === "element")
            .length.toString();
    }

    return preElement;
};

export const parseBlockCode = async (node: PreElement) => {
    const [blockCode] = node.children;
    const { value } = blockCode.children[0];
    if (!value) return;

    const code = value.replace(/\n$/, "");
    const meta = blockCode.data?.meta || "";
    const { title, insertLines, removeLines, highlightLines, lang } = parseMeta(meta);

    const options = await getCodeToHastOptions({
        lang,
        meta: { "data-title": title, "data-language": lang },
        transformers: [
            transformHighlightLine(highlightLines),
            transformInsertLine(insertLines),
            transformRemoveLine(removeLines),
        ],
    });
    const preElement = await highlightCode(code, options);

    return preElement;
};
