import path from "path";

import { blogConfig, getBlogConfigPaths } from "share/config";
import {
    getHighlighter,
    type HtmlRendererOptions,
    type IThemedToken,
    loadTheme,
    renderToHtml,
} from "shiki";

import type { Html, Root } from "hast";
// @ts-ignore
import type { Transformer } from "unified";

type ElementsOptions = NonNullable<HtmlRendererOptions["elements"]>;

const getElements = (lang: string | undefined, code: string): ElementsOptions => ({
    pre: props => {
        const { className, children } = props;

        const classname = className
            ? className.includes("shiki")
                ? className
                : `shiki ${className}`
            : "shiki";

        const properties = [`class="${classname}"`];
        lang && properties.push(`data-language="${lang}"`);
        // code && properties.push(`data-code="${code}"`);

        return `<pre ${properties.join(" ")}>${children}</pre>`;
    },
});

const getShikiInstances = async () => {
    const paths = getBlogConfigPaths();

    let { theme } = blogConfig.code;
    if (paths.themes) {
        theme = theme.map(name => path.resolve(paths.themes, `${name}.json`));
    }

    const loadedThemes = await Promise.all(theme.map(loadTheme));
    const instances = await Promise.all(loadedThemes.map(theme => ({ theme })).map(getHighlighter));

    return instances;
};

const replaceColorByVar = (lines: IThemedToken[][], colors: Map<string, string>) =>
    lines.map(tokens =>
        tokens.map(token => {
            if (token.color) {
                const color = token.color.toLowerCase();
                const cssVar = colors.get(color);

                if (cssVar) {
                    token.color = `var(${cssVar})`;
                } else {
                    const newCssVar = `--${colors.size + 1}`;
                    colors.set(color, newCssVar);
                    token.color = `var(${newCssVar})`;
                }
            }
            return token;
        }),
    );

export const remarkShiki = (): Transformer<Root> => {
    const promises = getShikiInstances();

    return async (tree, file, next) => {
        const { visit } = await import("unist-util-visit");

        const instances = await promises;
        const colors = instances
            .map(instance => instance.getTheme())
            .map(({ fg, bg }) => [fg.toLowerCase(), bg.toLowerCase()])
            .map(colors => colors.map((color, index) => [color, `--${index + 1}`] as const))
            .map(pairs => new Map(pairs));

        let hasCode = false;

        visit(tree, "code", node => {
            hasCode = true;

            const { value } = node;
            const lang = node.lang || undefined;

            const tokens = instances
                .map(instance => instance.codeToThemedTokens(value, lang))
                .map((lines, index) => replaceColorByVar(lines, colors[index]));

            const html = renderToHtml(tokens[0], {
                fg: "var(--0)",
                bg: "var(--1)",
                elements: getElements(lang, value),
            });

            (node as unknown as Html).type = "html";
            node.value = html;
        });

        if (hasCode) {
            const css = colors
                .map(map => [...map].map(([color, cssVar]) => `${cssVar}:${color};`).join(""))
                .map((css, index) => (index ? `pre.shiki.dark{${css}}` : `pre.shiki{${css}}`))
                .join("\n");

            tree.children.unshift({
                type: "html",
                value: `<style>${css}</style>`,
            });
        }

        next(null, tree);
    };
};
