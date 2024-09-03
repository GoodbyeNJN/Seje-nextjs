import path from "node:path";

import { getPlaiceholder } from "plaiceholder";
import { isString } from "remeda";

import { blogPath } from "server/constants";
import { visitAsync } from "server/utils/unified";
import { createDebugger } from "utils/debug";
import { exists } from "utils/fs";
import { createLogger } from "utils/logger";
import { parseUnknownError } from "utils/parse";
import { isFullUrl } from "utils/string";

import type { Element, Properties, Root } from "hast";
import type { Transformer } from "unified";
import type { Node } from "unist";

interface ImgElement extends Element {
    properties: Properties & { src: string };
}

const logger = createLogger("[rehype-image]");
const debug = createDebugger("[rehype-image]");

// 判断是否为带 src 属性的 img 元素
const isImgElement = (node: Node): node is ImgElement => {
    if (node.type !== "element") return false;

    const element = node as Element;

    return element.tagName === "img" && isString(element.properties.src);
};

const getLocalImagePath = async (src: string, filepath: string) => {
    // 如果 src 路径文件存在，则直接使用 src
    if (await exists(src)) return src;

    let imagePath = "";
    // 如果 src 是绝对路径
    if (path.isAbsolute(src)) {
        // 把 src 直接转换为相对路径
        const relativeImagePath = path.relative("/", src);
        // 以 blog 为根目录，解析 relativeImagePath
        imagePath = path.resolve(blogPath, relativeImagePath);
    } else {
        // 文件路径为 xx/xx/title.md 的多级目录形式
        // 转换为 xx/xx 的形式
        const dirpath = path.dirname(filepath);
        // 以 xx/xx 为根目录，解析 src
        imagePath = path.resolve(dirpath, src);
    }

    if (!(await exists(imagePath))) return;

    return imagePath;
};

const getRemoteImageInfo = async (src: string) => {
    let buffer: Buffer;
    try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    } catch (error) {
        logger.error("加载网络图片失败，请检查错误信息:");
        logger.error(parseUnknownError(error).message);

        return null;
    }

    try {
        const info = await getPlaiceholder(buffer);
        return info;
    } catch (error) {
        logger.error("获取缩略图失败，请检查错误信息:");
        logger.error(parseUnknownError(error).message);
        return null;
    }
};

// 处理图片，转换引入路径或生成宽高和 base64 缩略图
export const rehypeImage = (): Transformer<Root> => async (tree, file, next) => {
    await visitAsync(tree, isImgElement, async node => {
        debug.start("Main");

        const { src } = node.properties;

        try {
            // 判断是本地图片还是网络图片
            if (!isFullUrl(src)) {
                const imagePath = await getLocalImagePath(src, file.path);
                node.properties = { ...node.properties, type: "local", src: imagePath || src };

                return;
            }

            const info = await getRemoteImageInfo(src);
            if (!info) {
                node.properties = {
                    ...node.properties,
                    type: "remote",
                    src,
                    width: 512,
                    height: 512,
                };

                return;
            }

            const { metadata, base64 } = info;
            const { width, height } = metadata;
            node.properties = { ...node.properties, type: "remote", src, width, height, base64 };
        } finally {
            debug.end("Main");
        }
    });

    next(undefined, tree, file);
};
