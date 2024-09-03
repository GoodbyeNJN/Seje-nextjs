import path from "node:path";

import { transform } from "esbuild";
import fg from "fast-glob";
import { filter, isEmpty, map, pipe, prop, unique } from "remeda";

import {
    blogAssetPath,
    blogPath,
    clientAssetPath,
    clientPagePath,
    publicAssetPath,
} from "server/constants";
import { getValuesFromProcessEnv } from "server/utils/env";
import { VFile } from "server/utils/vfile";
import { createWatcher } from "server/utils/watcher";
import { createDebugger } from "utils/debug";
import { cp, rm, rmParent, safeReadFile, safeWriteFile } from "utils/fs";
import { createLogger } from "utils/logger";

import type { NextConfig } from "next";

interface Task {
    // 文件匹配模式，必须是 glob 表达式
    pattern: string;
    // 从哪里复制，必须是文件夹路径
    from: string;
    // 复制到哪里，必须是文件夹路径
    to: string;
    // 给定文件路径是否匹配该目标
    match: (vfile: VFile) => MaybePromise<boolean>;
    // 转换文件内容
    transform?: Transform;
}

type Action = (task: Task, vfile: VFile) => MaybePromise<void>;
type Transform = (vfile: VFile) => MaybePromise<void>;

const logger = createLogger("[asset-file-loader]");
const debug = createDebugger("[asset-file-loader]");
const { isProd, isWorkerThread } = getValuesFromProcessEnv();

const tasks: Task[] = [
    {
        // 复制 blog 文件夹下的 favicon.ico 文件
        pattern: "favicon.ico",
        from: blogPath,
        to: clientPagePath,
        match: ({ basename }) => basename === "favicon.ico",
    },
    {
        // 复制 blog/assets 文件夹下的所有文件
        pattern: "**/*",
        from: blogAssetPath,
        to: publicAssetPath,
        match: ({ extname }) => extname !== ".ts",
    },
    {
        // 复制 src/assets 文件夹下的非 ts 文件
        pattern: "**/*.!(ts)",
        from: clientAssetPath,
        to: publicAssetPath,
        match: ({ extname }) => extname !== ".ts",
    },
    {
        // 复制 src/assets 文件夹下的 ts 文件
        pattern: "**/*.ts",
        from: clientAssetPath,
        to: publicAssetPath,
        match: ({ extname }) => extname === ".ts",
        transform: async vfile => {
            if (!isEmpty(vfile.value)) {
                try {
                    const result = await transform(vfile.value, {
                        platform: "browser",
                        loader: "ts",
                        charset: "utf8",
                        format: "iife",
                        target: ["es2022"],
                        minify: true,
                    });
                    vfile.value = result.code;
                } catch (error) {
                    logger.error("编译文件失败，请检查错误信息:");
                    logger.error(error);
                    process.exit(1);
                }
            }

            vfile.extname = ".js";
        },
    },
];

const copy: Action = async ({ to, transform }, vfile) => {
    debug.start("Copy file: %s", vfile.relativePathname);

    if (!transform) {
        const src = vfile.pathname;

        vfile.cwd = to;
        const dest = vfile.pathname;

        await cp(src, dest);

        debug.end("Copy file: %s", vfile.relativePathname);

        return;
    }

    vfile.value = await safeReadFile(vfile.pathname);
    await transform(vfile);

    vfile.cwd = to;
    const dest = vfile.pathname;

    await safeWriteFile(dest, vfile.value);

    debug.end("Copy file: %s", vfile.relativePathname);
};

const remove: Action = async ({ to, transform }, vfile) => {
    debug.start("Remove file: %s", vfile.relativePathname);

    await transform?.(vfile);

    vfile.cwd = to;
    const dest = vfile.pathname;

    await rm(dest);

    try {
        // 尝试递归删除目标文件所在的文件夹
        await rmParent(dest, { recursive: true });
    } catch {
    } finally {
        debug.end("Remove file: %s", vfile.relativePathname);
    }
};

const onReady = async (filepaths: string[], action: Action) => {
    await Promise.all(filepaths.map(filepath => onMutate(filepath, action)));
};

const onMutate = async (filepath: string, action: Action) => {
    const matched = tasks
        .map(task => ({
            vfile: new VFile({ pathname: filepath, value: "", cwd: task.from }),
            ...task,
        }))
        .find(({ vfile, match }) => {
            const { relativePathname } = vfile;
            const isSubpath =
                !isEmpty(relativePathname) &&
                !relativePathname.startsWith("..") &&
                !path.isAbsolute(relativePathname);

            return isSubpath && match(vfile);
        });
    if (!matched) return;

    await action(matched, matched.vfile);
};

const onCleanup = async () => {
    const promises = pipe(
        tasks,
        filter(({ pattern }) => pattern !== "favicon.ico"),
        map(prop("to")),
        unique(),
        map(to => rm(to)),
    );

    await Promise.all(promises);

    await rm(path.resolve(clientPagePath, "favicon.ico"));
};

export const withAssetFileLoader = async (configOrPromise: MaybePromise<NextConfig>) => {
    debug.start("Main");

    if (isWorkerThread) return configOrPromise;

    await onCleanup();

    const patterns = tasks.map(({ pattern, from }) => path.resolve(fg.escapePath(from), pattern));
    if (isProd) {
        await onReady(await fg.async(patterns), copy);
    } else {
        createWatcher()
            .on("ready", filepaths => onReady(filepaths, copy))
            .on("create", filepath => onMutate(filepath, copy))
            .on("update", filepath => onMutate(filepath, copy))
            .on("remove", filepath => onMutate(filepath, remove))
            .add(patterns);
    }

    debug.end("Main");

    return configOrPromise;
};
