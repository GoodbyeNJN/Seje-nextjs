import { getPlaiceholder } from "plaiceholder";
import { getBlogPath, isString } from "share/utils";

import { isElement } from "./utils";

import type { Element, Root } from "hast";
// @ts-ignore
import type { Transformer } from "unified";

export interface ISize {
    width: number | undefined;
    height: number | undefined;
    orientation?: number;
    type?: string;
}
export interface ISizeCalculationResult extends ISize {
    images?: ISize[];
}

const reset = "\x1b[0m";
const red = "\x1b[31m";

const getImagePlaceholder = async (src: string, dir?: string) => {
    try {
        const placeholder = await getPlaiceholder(src, { dir });

        return placeholder;
    } catch (error) {
        const message = error instanceof Error ? error.message : error;
        console.log(
            `${red}error${reset} -`,
            `Get image placeholder failed!\n\tsrc: ${src}\n\terror: ${message}`,
        );

        return null;
    }
};

const visitor = async (node: Element, dir?: string) => {
    if (!isElement(node, "img") || !node.properties) {
        return;
    }

    const { src } = node.properties;
    if (!isString(src)) {
        return;
    }

    const placeholder = await getImagePlaceholder(src, dir);
    if (!placeholder) {
        return;
    }

    const { img, base64 } = placeholder;
    const { width, height } = img;

    node.properties = {
        ...node.properties,
        width,
        height,
        "data-url": base64,
    };
};

export const rehypeImage = (): Transformer<Root> => async (tree, file, next) => {
    const { visit } = await import("unist-util-visit");

    const elements: Element[] = [];
    visit(tree, "element", node => {
        elements.push(node);
    });

    await Promise.all(elements.map(node => visitor(node, getBlogPath())));

    next(null, tree);
};
