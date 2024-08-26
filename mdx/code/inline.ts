import { codeToHast } from "./highlighter";
import { findTokenFg, getCodeToHastOptions, getTheme, getThemeVarEntries } from "./theme";

import type { ThemeVar } from "./theme";
import type { CodeElement, ShikijiCode, ShikijiLineSpan, ShikijiRoot } from "./types";

const parseMeta = (meta: string) => {
    let token = "";
    let lang = "";
    if (meta.startsWith(".")) {
        token = meta.slice(1);
    } else if (meta) {
        lang = meta;
    }

    return { token, lang };
};

const highlightCodeByToken = async (code: string, token: string) => {
    const { isSingleTheme, dark, light } = await getTheme();

    const vars: ThemeVar[] = ["fg", "bg"];

    let codeElementStyle = "";
    let tokenElementStyle = "";
    if (isSingleTheme) {
        getThemeVarEntries(dark, vars).forEach(([k, v]) => {
            codeElementStyle += `--${k}:${v};`;
        });

        const tokenFg = findTokenFg(dark, token);
        if (tokenFg) {
            tokenElementStyle = `--fg:${tokenFg};`;
        }
    } else {
        getThemeVarEntries(light, vars).forEach(([k, v]) => {
            codeElementStyle += `--light-${k}:${v};`;
        });
        getThemeVarEntries(dark, vars).forEach(([k, v]) => {
            codeElementStyle += `--dark-${k}:${v};`;
        });

        const darkTokenFg = findTokenFg(dark, token);
        const lightTokenFg = findTokenFg(light, token);
        if (darkTokenFg && lightTokenFg) {
            tokenElementStyle = `--light-fg:${lightTokenFg};--dark-fg:${darkTokenFg};`;
        }
    }

    const codeElement: ShikijiCode = {
        type: "element",
        tagName: "code",
        properties: {
            class: "shiki",
            style: codeElementStyle,
        },
        children: [
            {
                type: "element",
                tagName: "span",
                properties: { class: "line" },
                children: [
                    {
                        type: "element",
                        tagName: "span",
                        properties: { style: tokenElementStyle },
                        children: [{ type: "text", value: code }],
                    },
                ],
            },
        ],
    };

    return codeElement;
};

const highlightCodeByLanguage = async (code: string, language: string) => {
    const options = await getCodeToHastOptions({
        lang: language,
        meta: { "data-language": language },
    });

    const rootElement = codeToHast(code, options) as ShikijiRoot;
    const [preElement] = rootElement.children;
    const [codeElement] = preElement.children;
    const [lineElement] = codeElement.children;

    codeElement.properties = {
        class: "shiki",
        style: preElement.properties.style,
    };
    codeElement.children = lineElement.children as unknown as
        | [ShikijiLineSpan]
        | ArrayWithAtLeastOneItem<ShikijiLineSpan>;

    return codeElement;
};

const highlightCodeByDefault = async (code: string) => {
    const { isSingleTheme, dark, light } = await getTheme();

    const vars: ThemeVar[] = ["fg", "bg"];

    let codeElementStyle = "";
    if (isSingleTheme) {
        getThemeVarEntries(dark, vars).forEach(([k, v]) => {
            codeElementStyle += `--fg${k}:${v};`;
        });
    } else {
        getThemeVarEntries(light, vars).forEach(([k, v]) => {
            codeElementStyle += `--light-${k}:${v};`;
        });
        getThemeVarEntries(dark, vars).forEach(([k, v]) => {
            codeElementStyle += `--dark-${k}:${v};`;
        });
    }

    const codeElement: ShikijiCode = {
        type: "element",
        tagName: "code",
        properties: {
            class: "shiki",
            style: codeElementStyle,
        },
        children: [
            {
                type: "element",
                tagName: "span",
                properties: { class: "line" },
                children: [
                    {
                        type: "element",
                        tagName: "span",
                        properties: {},
                        children: [{ type: "text", value: code }],
                    },
                ],
            },
        ],
    };

    return codeElement;
};

export const parseInlineCode = async (node: CodeElement) => {
    const { value } = node.children[0];
    if (!value) return;

    const code = value.replace(/{:[a-zA-Z.-]+}/, "");
    const meta = value.match(/{:([a-zA-Z.-]+)}$/)?.[1] || "";
    const { token, lang } = parseMeta(meta);

    let codeElement: ShikijiCode;
    if (token) {
        codeElement = await highlightCodeByToken(code, token);
    } else if (lang) {
        codeElement = await highlightCodeByLanguage(code, lang);
    } else {
        codeElement = await highlightCodeByDefault(code);
    }

    return codeElement;
};
