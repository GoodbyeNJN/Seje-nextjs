import { blogConfig } from "share/config";

import { getClassName, hasClassName, isElement, setClassName } from "./utils";

import type { Element, Node, Root } from "hast";
// @ts-ignore
import type { Transformer } from "unified";

const isSingleCodeTheme = blogConfig.code.theme.length === 1;

const isShikiPreElement = (node: Node) => isElement(node, "pre") && hasClassName(node, "shiki");

const getThemes = () => {
    let map: { name: string; theme: string }[] = [];

    if (isSingleCodeTheme) {
        const [name] = blogConfig.code.theme;
        map = [{ name, theme: "" }];
    } else {
        const [light, dark] = blogConfig.code.theme;
        map = [
            { name: light, theme: "light" },
            { name: dark, theme: "dark" },
        ];
    }

    return map;
};

export const rehypeShikiTwoslash = (): Transformer<Root> => async (tree, file, next) => {
    const { visit } = await import("unist-util-visit");

    visit(tree, "element", (node: Element) => {
        if (isShikiPreElement(node)) {
            getThemes().forEach(item => {
                const { name, theme } = item;
                if (!hasClassName(node, name)) {
                    return;
                }

                const classNames = getClassName(node).map(className =>
                    className === name ? theme : className,
                );
                setClassName(node, classNames);
            });
        }

        if (isElement(node, "data-lsp") && node.properties?.style) {
            delete node.properties.style;
        }
    });

    next(null, tree);
};
