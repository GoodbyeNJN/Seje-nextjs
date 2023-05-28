import { visit } from "unist-util-visit";

import { blogConfig } from "@/config";

import { getClassName, hasClassName, isElement, setClassName } from "./utils";

import type { Element, Node, Root } from "hast";
import type { Transformer } from "unified";

const isShikiPreElement = (node: Node) => isElement(node, "pre") && hasClassName(node, "shiki");

const getThemes = () => {
    const { theme } = blogConfig.code;

    let map: { name: string; theme: string }[] = [];

    const [light, dark] = theme;
    if (dark) {
        map = [
            { name: light, theme: "light" },
            { name: dark, theme: "dark" },
        ];
    } else {
        map = [{ name: light, theme: "" }];
    }

    return map;
};

export const rehypeShikiTwoslash = (): Transformer<Root> => (tree, file, next) => {
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
