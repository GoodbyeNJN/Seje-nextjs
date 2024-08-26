import fs from "node:fs";

import glob from "fast-glob";

import { createLogger } from "@/utils/logger";
import { getGlob, getNextMarkdownPath, getPublicPath } from "@/utils/path";

import type { CommonOptions } from "./types";

export type Options = CommonOptions;

const logger = createLogger("[clear-public]");

let isPublicPathCleared = false;
let isNextPagePathCleared = false;

export const clearPublicPath = async (options: Options) => {
    const { isDev } = options;

    // 开发模式下只在初次构建时清空
    if (isDev && isPublicPathCleared) return;

    // 保留 .gitkeep 文件
    const filepaths = await glob(`${getPublicPath()}/!(.gitkeep)`, { onlyFiles: false });

    try {
        await Promise.all(
            filepaths.map(filepath => fs.promises.rm(filepath, { recursive: true, force: true })),
        );
        isPublicPathCleared = true;
    } catch (error) {
        logger.error("清空 public 文件夹失败，请检查错误信息:");
        logger.error(error);
        process.exit(1);
    }
};

export const clearMarkdownPath = async (options: Options) => {
    const { isDev } = options;

    // 开发模式下只在初次构建时清空
    if (isDev && isNextPagePathCleared) return;

    const filepaths = await glob(`${getGlob(getNextMarkdownPath())}/*`, {
        onlyFiles: false,
    });

    try {
        await Promise.all(
            filepaths.map(filepath => fs.promises.rm(filepath, { recursive: true, force: true })),
        );
        isNextPagePathCleared = true;
    } catch (error) {
        logger.error("清空 src/app/(markdowns) 文件夹失败，请检查错误信息:");
        logger.error(error);
        process.exit(1);
    }
};

export const clearConsole = () => {
    console.clear();
};
