import path from "node:path";

import fs from "fs-extra";
import { getPlaiceholder } from "plaiceholder";
import { visit } from "unist-util-visit";

import { blogPath } from "@/config/path";
import { logger } from "@/utils/logger";
import { isString } from "@/utils/type";
import { isFullUrl, joinPathnameWithBasePath } from "@/utils/url";

import { isElement } from "./utils";

import type { Element, Node, Properties, Root } from "hast";
import type { Transformer } from "unified";

interface ImgElement extends Element {
    properties: Properties & { src: string };
}

const isImgElement = (node: Node): node is ImgElement =>
    Boolean(isElement(node, "img") && isString(node.properties?.src));

const getImagePlaceholder = async (src: string) => {
    try {
        let buffer: Buffer;
        if (isFullUrl(src)) {
            buffer = await fetch(src)
                .then(res => res.arrayBuffer())
                .then(buffer => Buffer.from(buffer))
                .catch(err => {
                    throw new Error("Load remote image failed:", err.message || err);
                });
        } else {
            const filepath = path.isAbsolute(src)
                ? fs.existsSync(src)
                    ? src
                    : path.resolve(blogPath, src.slice(1))
                : path.resolve(blogPath, src);

            if (!fs.existsSync(filepath)) {
                throw new Error(`Load local image failed: "${filepath}" not found!`);
            }

            buffer = await fs.readFile(filepath);
        }

        const placeholder = await getPlaiceholder(buffer);

        return placeholder;
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        logger.error("Get image placeholder failed!");
        message.split("\n").forEach(line => logger.error(line));

        return null;
    }
};

const visitor = async (node: ImgElement) => {
    const { src } = node.properties;
    const placeholder = await getImagePlaceholder(src);
    if (!placeholder) {
        return;
    }

    const { metadata, base64 } = placeholder;
    const { width, height } = metadata;
    const url = isFullUrl(src) ? src : joinPathnameWithBasePath(src);

    node.properties = {
        ...node.properties,
        src: url,
        width,
        height,
        base64,
    };
};

export const rehypeImage = (): Transformer<Root> => async (tree, file, next) => {
    const elements: ImgElement[] = [];
    visit(tree, "element", node => {
        if (isImgElement(node)) {
            elements.push(node);
        }
    });

    await Promise.all(elements.map(visitor));

    next(null, tree);
};
