import fs from "node:fs";
import path from "node:path";

import { getPlaiceholder } from "plaiceholder";

import { createLogger } from "@/utils/logger";
import { getBlogLayoutPath, getBlogPath, getBlogPostPath, getNextMarkdownPath } from "@/utils/path";
import { isFullUrl } from "@/utils/url";

import { isElement, visitAsync } from "./utils";

import type { Element, Properties, Root } from "hast";
import type { Transformer } from "unified";
import type { Node } from "unist";

interface ImgElement extends Element {
    properties: Properties & { src: string };
}

const logger = createLogger("[rehype-image]");

// 判断是否为带 src 属性的 img 元素
const isImgElement = (node: Node): node is ImgElement =>
    isElement(node, "img") && R.isString(node.properties.src);

const getLocalImagePath = (src: string, filepath: string) => {
    // 如果 src 路径文件存在，则直接使用 src
    if (fs.existsSync(src)) {
        return src;
    }

    const { name } = path.parse(filepath);

    let imagePath = "";
    // 如果 src 是绝对路径
    if (path.isAbsolute(src)) {
        // 把 src 直接转换为相对路径
        const relativeImagePath = path.relative("/", src);
        // 以 blog 为根目录，解析 relativeImagePath
        imagePath = path.resolve(getBlogPath(), relativeImagePath);
    } else if (name === "page") {
        // 文件路径为 xx/xx/title/page.md 的多级目录形式
        // 以 src/app/(markdowns) 为根目录，把 filepath 转换为相对路径
        const relativeFilePath = path.relative(getNextMarkdownPath(), filepath);
        // 转换为 xx/xx 的形式
        const relativeFileBasepath = path.join(relativeFilePath, "../..");
        // 以 blog/posts 为根目录，解析 relativeFileBasepath
        const imageBasepath = path.resolve(getBlogPostPath(), relativeFileBasepath);
        // 以 imageBasepath 为根目录，解析 src
        imagePath = path.resolve(imageBasepath, src);
    } else {
        // 文件路径为 xx/xx/title.md 的多级目录形式
        // 以 blog/layouts 为根目录，解析 src
        imagePath = path.resolve(getBlogLayoutPath(), src);
    }

    return fs.existsSync(imagePath) ? imagePath : undefined;
};

const getRemoteImageInfo = async (src: string) => {
    let buffer: Buffer;
    try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    } catch (error) {
        logger.error("加载网络图片失败，请检查错误信息:");
        logger.error(error);
        return null;
    }

    try {
        const info = await getPlaiceholder(buffer);
        return info;
    } catch (error) {
        logger.error("获取缩略图失败，请检查错误信息:");
        logger.error(error);
        return null;
    }
};

// 处理图片，转换引入路径或生成宽高和 base64 缩略图
export const rehypeImage = (): Transformer<Root> => async (tree, file, next) => {
    await visitAsync(tree, isImgElement, async node => {
        const { src } = node.properties;

        // 判断是本地图片还是网络图片
        if (!isFullUrl(src)) {
            const imagePath = getLocalImagePath(src, file.path);
            node.properties = { ...node.properties, type: "local", src: imagePath || src };
            node.properties.src = imagePath || src;
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
                // img-load-failed.svg 的 base64 编码
                base64: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDI0IDEwMjQnIHdpZHRoPScyMDAnIGhlaWdodD0nMjAwJz48cGF0aCBkPSdNMzA0LjEyOCA0NTYuMTkyYzQ4LjY0IDAgODguMDY0LTM5LjQyNCA4OC4wNjQtODguMDY0cy0zOS40MjQtODguMDY0LTg4LjA2NC04OC4wNjQtODguMDY0IDM5LjQyNC04OC4wNjQgODguMDY0IDM5LjQyNCA4OC4wNjQgODguMDY0IDg4LjA2NHptMC0xMTYuMjI0YzE1LjM2IDAgMjguMTYgMTIuMjg4IDI4LjE2IDI4LjE2cy0xMi4yODggMjguMTYtMjguMTYgMjguMTYtMjguMTYtMTIuMjg4LTI4LjE2LTI4LjE2IDEyLjI4OC0yOC4xNiAyOC4xNi0yOC4xNnonLz48cGF0aCBkPSdNODg3LjI5NiAxNTkuNzQ0SDEzNi43MDRDOTYuNzY4IDE1OS43NDQgNjQgMTkyIDY0IDIzMi40NDh2NTU5LjEwNGMwIDM5LjkzNiAzMi4yNTYgNzIuNzA0IDcyLjcwNCA3Mi43MDRoMTk4LjE0NEw1MDAuMjI0IDY4OC42NGwtMzYuMzUyLTIyMi43MiAxNjIuMzA0LTEzMC41Ni02MS40NCAxNDMuODcyIDkyLjY3MiAyMTQuMDE2LTEwNS40NzIgMTcxLjAwOGgzMzUuMzZDOTI3LjIzMiA4NjQuMjU2IDk2MCA4MzIgOTYwIDc5MS41NTJWMjMyLjQ0OGMwLTM5LjkzNi0zMi4yNTYtNzIuNzA0LTcyLjcwNC03Mi43MDR6bS0xMzguNzUyIDcxLjY4di41MTJIODU3LjZjMTYuMzg0IDAgMzAuMjA4IDEzLjMxMiAzMC4yMDggMzAuMjA4djM5OS44NzJMNjczLjI4IDQwOC4wNjRsNzUuMjY0LTE3Ni42NHpNMzA0LjY0IDc5Mi4wNjRIMTY1Ljg4OGMtMTYuMzg0IDAtMzAuMjA4LTEzLjMxMi0zMC4yMDgtMzAuMjA4di05LjcyOGwxMzguNzUyLTE2NC4zNTIgMTA0Ljk2IDEyNC40MTYtNzQuNzUyIDc5Ljg3MnptODEuOTItMzU1Ljg0bDM3LjM3NiAyMjguODY0LS41MTIuNTEyLTE0Mi44NDgtMTY5Ljk4NGMtMy4wNzItMy41ODQtOS4yMTYtMy41ODQtMTIuMjg4IDBMMTM1LjY4IDY1Mi44VjI2Mi4xNDRjMC0xNi4zODQgMTMuMzEyLTMwLjIwOCAzMC4yMDgtMzAuMjA4aDQ3NC42MjRMMzg2LjU2IDQzNi4yMjR6bTUwMS4yNDggMzI1LjYzMmMwIDE2Ljg5Ni0xMy4zMTIgMzAuMjA4LTI5LjY5NiAzMC4yMDhINjgwLjk2bDU3LjM0NC05My4xODQtODcuNTUyLTIwMi4yNCA3LjE2OC03LjY4IDIyOS44ODggMjcyLjg5NnonLz48L3N2Zz4=",
            };
            return;
        }

        const { metadata, base64 } = info;
        const { width, height } = metadata;
        node.properties = { ...node.properties, type: "remote", src, width, height, base64 };
    });

    next(undefined, tree);
};
