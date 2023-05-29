import { h } from "hastscript";
import { visit } from "unist-util-visit";

import { isElement } from "./utils";

import type { Element, Node, Properties, Root } from "hast";
import type { Transformer } from "unified";

interface StyleProperties {
    style: string;
}

interface ThemeProperties {
    "data-language": string;
    "data-theme": string;
}

interface FragmentProperties {
    "data-rehype-pretty-code-fragment": string;
}

interface CustomElement<T> extends Element {
    properties: Properties & T;
}

type StyledElement = CustomElement<StyleProperties>;
type StyledThemedElement = CustomElement<StyleProperties & ThemeProperties>;
type Fragment = CustomElement<FragmentProperties>;

interface SingleThemeFragment extends CustomElement<FragmentProperties> {
    children: [StyledThemedElement];
}

interface DoubleThemeFragment extends CustomElement<FragmentProperties> {
    children: [StyledThemedElement, StyledThemedElement];
}

const isStyledElement = (node?: Node): node is StyledElement =>
    Boolean(isElement(node) && node.properties && Object.hasOwn(node.properties, "style"));

const isStyledThemedElement = (node?: Node): node is StyledThemedElement =>
    Boolean(
        isStyledElement(node) &&
            Object.hasOwn(node.properties, "data-language") &&
            Object.hasOwn(node.properties, "data-theme"),
    );

const isFragment = (node: Element): node is Fragment =>
    Boolean(node.properties && Object.hasOwn(node.properties, "data-rehype-pretty-code-fragment"));

const isSingleThemeFragment = (node: Element): node is SingleThemeFragment =>
    isFragment(node) && node.children.length === 1 && isStyledThemedElement(node.children[0]);

const isDoubleThemeFragment = (node: Element): node is DoubleThemeFragment =>
    isFragment(node) &&
    node.children.length === 2 &&
    isStyledThemedElement(node.children[0]) &&
    isStyledThemedElement(node.children[1]);

const lightColors: string[] = [];
const darkColors: string[] = [];

const regex = /(#([0-9a-f]{6}|[0-9a-f]{3}))/g;

const visitChild = (child: StyledThemedElement) => {
    const colors = child.properties["data-theme"] === "light" ? lightColors : darkColors;

    visit(child, grandChild => {
        if (!isStyledElement(grandChild)) {
            return;
        }

        const style = grandChild.properties.style.toLowerCase();

        style.match(regex)?.forEach(color => {
            if (!colors.includes(color)) {
                colors.push(color);
            }
        });

        grandChild.properties.style = style.replace(
            regex,
            match => `var(--${colors.findIndex(color => color === match)})`,
        );
    });
};

export const rehypeCode = (): Transformer<Root> => async (tree, file, next) => {
    visit(tree, "element", node => {
        if (!isFragment(node)) {
            return;
        }

        if (isSingleThemeFragment(node)) {
            const [child] = node.children;
            node.properties["data-language"] = child.properties["data-language"];
        } else if (isDoubleThemeFragment(node)) {
            const [child1, child2] = node.children;
            visitChild(child1);
            visitChild(child2);

            node.children.pop();
            node.properties["data-language"] = child1.properties["data-language"];
        }
    });

    const style = `html.light {${lightColors
        .map((value, index) => `--${index}:${value}`)
        .join("; ")}} html.dark {${darkColors
        .map((value, index) => `--${index}:${value}`)
        .join("; ")}} `;
    tree.children.unshift(h("style", { hidden: true }, style) as any);

    next(null, tree);
};
