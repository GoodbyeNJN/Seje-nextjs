import fs from "node:fs";
import path from "node:path";

import { transform } from "esbuild";
import glob from "fast-glob";
import * as R from "remeda";

import { createLogger } from "@/utils/logger";
import {
    getBlogAssetPath,
    getBlogLayoutPath,
    getBlogPath,
    getBlogPostPath,
    getGlob,
    getNextAssetPath,
    getNextMarkdownPath,
    getPublicAssetPath,
    getPublicPath,
} from "@/utils/path";
import { Watcher } from "@/utils/watcher";

import type { CommonOptions } from "./types";
import type { TransformOptions } from "esbuild";
import type { ParsedPath } from "node:path";

export interface Options extends CommonOptions {
    preview?: boolean;
}

interface Filepath extends ParsedPath {
    full: string;
}

type MaybePromise<T> = T | Promise<T>;

interface Target {
    // 从哪里复制，必须是 glob 表达式
    from: string;
    // 复制到哪里，必须是文件夹路径
    to: string;
    // 给定文件路径是否匹配该目标
    match: (filepath: Filepath) => MaybePromise<boolean>;
    // 重命名文件名，支持带文件夹层级的文件名
    rename: (filepath: Filepath) => MaybePromise<string>;
    // 转换文件内容，返回 null 时不复制该文件
    transform?: (content: string, filepath: Filepath) => MaybePromise<string | null>;
}

const logger = createLogger("[copy-files]");

const isSubpath = (parent: string, child: string) => {
    const relative = path.relative(parent, child);
    return R.isTruthy(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
};

const parseFilepath = (filepath: string): Filepath => ({
    ...path.parse(filepath),
    full: filepath,
});

const compile = async (content: string) => {
    const transformOptions: TransformOptions = {
        platform: "browser",

        loader: "ts",

        format: "iife",

        target: ["es2022"],

        minify: true,
    };

    try {
        const { code } = await transform(content, transformOptions);
        return code;
    } catch (error) {
        logger.error("编译文件失败，请检查错误信息:");
        logger.error(error);
        process.exit(1);
    }
};

const getTargets = (preview: boolean): Target[] => [
    {
        // 复制 blog 文件夹下的 favicon.ico 文件
        from: `${getGlob(getBlogPath())}/favicon.ico`,
        to: getPublicPath(),
        match: ({ full }) => `${getBlogPath()}/favicon.ico` === full,
        rename: () => "favicon.ico",
    },
    {
        // 复制 blog/posts 文件夹下的 markdown 文件
        from: `${getGlob(getBlogPostPath())}/**/*.{md,mdx}`,
        to: getNextMarkdownPath(),
        match: ({ full }) => isSubpath(getBlogPostPath(), full),
        // 将 title.md 文件重命名为 title/page.md
        // 如果是预览模式，将草稿文件名前的下划线去掉
        rename: ({ dir, name, ext }) =>
            path.join(
                path.relative(getBlogPostPath(), dir),
                preview ? name.replace(/^_/, "") : name,
                `page${ext}`,
            ),
    },
    {
        // 复制 blog/layouts 文件夹下的 markdown 文件
        from: `${getGlob(getBlogLayoutPath())}/**/*.{md,mdx}`,
        to: getNextMarkdownPath(),
        match: ({ full }) => isSubpath(getBlogLayoutPath(), full),
        rename: ({ full }) => path.relative(getBlogLayoutPath(), full),
    },
    {
        // 复制 blog/assets 文件夹下的非 ts 文件
        from: `${getGlob(getBlogAssetPath())}/**/*.!(ts)`,
        to: getPublicAssetPath(),
        match: ({ full }) => isSubpath(getBlogAssetPath(), full),
        rename: ({ full }) => path.relative(getBlogAssetPath(), full),
    },
    {
        // 复制 blog/assets 文件夹下的 ts 文件
        from: `${getGlob(getBlogAssetPath())}/**/*.ts`,
        to: getPublicAssetPath(),
        match: ({ full }) => isSubpath(getBlogAssetPath(), full),
        rename: ({ dir, name }) => path.join(path.relative(getBlogAssetPath(), dir), `${name}.js`),
        transform: compile,
    },
    // {
    //     // 复制 src/assets 文件夹下的非 ts 文件
    //     from: `${getGlob(getNextAssetPath())}/**/*.!(ts)`,
    //     to: getPublicAssetPath(),
    //     match: ({ full }) => isSubpath(getNextAssetPath(), full),
    //     rename: ({ full }) => path.relative(getNextAssetPath(), full),
    // },
    {
        // 复制 src/assets 文件夹下的 ts 文件
        from: `${getGlob(getNextAssetPath())}/**/*.ts`,
        to: getPublicAssetPath(),
        match: ({ full }) => isSubpath(getNextAssetPath(), full),
        rename: ({ dir, name }) => path.join(path.relative(getNextAssetPath(), dir), `${name}.js`),
        transform: compile,
    },
];

let watcher: Watcher | undefined;

export const copy = async (filepath: Filepath, target: Target) => {
    const { to, rename, transform } = target;

    const dest = path.resolve(to, await rename(filepath));
    // 递归创建目标文件的上层文件夹
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });

    if (!transform) {
        await fs.promises.copyFile(filepath.full, dest);
        return;
    }

    const content = await fs.promises.readFile(filepath.full, "utf-8");
    const transformed = await transform(content, filepath);
    if (R.isNullish(transformed)) return;

    await fs.promises.writeFile(dest, transformed, "utf-8");
};

export const remove = async (filepath: Filepath, target: Target) => {
    const { to, rename } = target;

    const dest = path.resolve(to, await rename(filepath));
    await fs.promises.rm(dest, { recursive: true, force: true });

    try {
        // 尝试删除目标文件所在的文件夹
        // 如果文件夹为空则会正常删除，如果文件夹不为空则忽略错误
        await fs.promises.rmdir(path.dirname(dest));
    } catch {}
};

export const copyFiles = async (options: Options) => {
    const { preview = false } = options;

    const targets = await Promise.all(
        getTargets(preview).map(async target => ({ files: await glob(target.from), target })),
    );

    await Promise.all(
        targets.map(({ files, target }) =>
            Promise.all(files.map(file => copy(parseFilepath(file), target))),
        ),
    );
};

export const watchFiles = async (options: Options) => {
    const { preview = false, isProd } = options;

    // 生产模式下不需要监听
    // 已经存在监听器时不需要重复监听
    if (isProd || watcher) return;

    watcher = new Watcher(getTargets(preview).map(({ from }) => from));
    watcher
        .on("event", async event => {
            switch (event.type) {
                case "create":
                case "update": {
                    const filepath = parseFilepath(event.path);
                    const target = getTargets(preview).find(({ match }) => match(filepath));

                    if (target) {
                        await copy(filepath, target);
                    } else {
                        logger.error("无法匹配的文件路径:", event.path);
                    }
                    break;
                }

                case "remove": {
                    const filepath = parseFilepath(event.path);
                    const target = getTargets(preview).find(({ match }) => match(filepath));

                    if (target) {
                        await remove(filepath, target);
                    } else {
                        logger.error("无法匹配的文件路径:", event.path);
                    }
                    break;
                }
            }
        })
        .on("error", error => {
            logger.error("监听文件修改失败，请检查错误信息:");
            logger.error(error);
            process.exit(1);
        });
};
