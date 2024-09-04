import path from "node:path";

import dayjs from "dayjs";
import { transform } from "esbuild";
import fg from "fast-glob";
import { isEmpty, map, pipe, prop, sortBy, unique } from "remeda";

import { getBlogConfig } from "server/blog/validate";
import {
    blogComponentPath,
    blogPagePath,
    publicMdxPath,
    tempComponentPath,
    tempManifestPath,
    tempMetadataPath,
    tempPagePath,
} from "server/constants";
import {
    parseMdxFile,
    transformComponent,
    transformNavbarComponent,
    transformPage,
    transformSummary,
} from "server/mdx";
import { getValuesFromProcessEnv } from "server/utils/env";
import { VFile } from "server/utils/vfile";
import { createWatcher } from "server/utils/watcher";
import { createDebugger } from "utils/debug";
import { rm, rmParent, safeReadFile, safeWriteFile, safeWriteJson } from "utils/fs";
import { createLogger } from "utils/logger";
import { removeLeadingUnderscore, removeTrailingPageType } from "utils/string";

import type { NextConfig } from "next";
import type { Metadata } from "server/types";

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
    transform: Transform;
}

type Action = (task: Task, vfile: VFile) => MaybePromise<void>;
type Transform = (vfile: VFile) => MaybePromise<void | null>;

const logger = createLogger("[mdx-file-loader]");
const debug = createDebugger("[mdx-file-loader]");
const { isDev, isProd, isDeployPreview, isWorkerThread } = getValuesFromProcessEnv();

const blogConfig = getBlogConfig();
const { showSummary } = blogConfig.home;

const metadataMap = new Map<string, Metadata>();

const EXCLUDE_DRAFTS_PATTERN = "**/!(_)*.{md,mdx}";
const ALL_MARKDOWN_PATTERN = "**/*.{md,mdx}";
const pattern = isProd || isDeployPreview ? EXCLUDE_DRAFTS_PATTERN : ALL_MARKDOWN_PATTERN;

const isMdxFile = ({ extname }: VFile) => extname === ".md" || extname === ".mdx";

const tasks: Task[] = [
    // 将所有 markdown 文件转换为页面组件
    {
        pattern,
        from: blogPagePath,
        to: tempPagePath,
        match: isMdxFile,
        transform: async vfile => {
            if (!isEmpty(vfile.value)) {
                const file = vfile.clone();
                const { metadata, page } = await parseMdxFile(file);

                file.value = page;
                vfile.value = await transformPage(file);

                metadataMap.set(vfile.relativePathname, metadata);
            } else {
                metadataMap.delete(vfile.relativePathname);
            }

            // 如果是预览模式，将草稿文件名前的下划线去掉
            // 如果带类型后缀，去掉后缀
            vfile.filename = removeTrailingPageType(removeLeadingUnderscore(vfile.filename));
            vfile.extname = ".jsx";
        },
    },

    // 将 post 文件中的 summary 转换为可远程加载的组件
    {
        pattern,
        from: blogPagePath,
        to: publicMdxPath,
        match: vfile => isMdxFile(vfile) && !vfile.filename.endsWith(".page"),
        transform: async vfile => {
            if (!isEmpty(vfile.value)) {
                const file = vfile.clone();
                const { summary, page } = await parseMdxFile(file);

                file.value = showSummary ? summary : page;
                file.value = await transformSummary(file);

                if (isProd) {
                    try {
                        const result = await transform(file.value, {
                            platform: "browser",
                            loader: "js",
                            charset: "utf8",
                            format: "esm",
                            target: ["es2022"],
                            minify: true,
                        });
                        file.value = result.code;
                    } catch (error) {
                        logger.error("压缩文件失败，请检查错误信息:");
                        logger.error(error);
                        process.exit(1);
                    }
                }

                vfile.value = file.value;
            }

            // 如果是预览模式，将草稿文件名前的下划线去掉
            // 如果带类型后缀，去掉后缀
            vfile.filename = removeTrailingPageType(removeLeadingUnderscore(vfile.filename));
            vfile.extname = ".js";
        },
    },

    // 将 component 文件转换为组件
    {
        pattern: ALL_MARKDOWN_PATTERN,
        from: blogComponentPath,
        to: tempComponentPath,
        match: isMdxFile,
        transform: async vfile => {
            if (!isEmpty(vfile.value)) {
                const file = vfile.clone();
                const { page } = await parseMdxFile(file);

                file.value = page;

                vfile.value = await transformComponent(file);
            }

            vfile.extname = ".jsx";
        },
    },

    // 提取 navbar 文件中的列表链接
    {
        pattern: ALL_MARKDOWN_PATTERN,
        from: blogComponentPath,
        to: tempManifestPath,
        match: vfile => isMdxFile(vfile) && vfile.filename === "navbar",
        transform: async vfile => {
            if (!isEmpty(vfile.value)) {
                const file = vfile.clone();
                const { page } = await parseMdxFile(file);

                file.value = page;

                vfile.value = await transformNavbarComponent(file);
            }

            vfile.extname = ".json";
        },
    },
];

const copy: Action = async ({ to, transform }, vfile) => {
    debug.start("Copy file: %s", vfile.relativePathname);

    await transform(vfile);

    vfile.cwd = to;
    const dest = vfile.pathname;

    await safeWriteFile(dest, vfile.value);

    debug.end("Copy file: %s", vfile.relativePathname);
};

const remove: Action = async ({ to, transform }, vfile) => {
    debug.start("Remove file: %s", vfile.relativePathname);

    await transform(vfile);

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
        .filter(({ vfile, match }) => {
            const { relativePathname } = vfile;
            const isSubpath =
                !isEmpty(relativePathname) &&
                !relativePathname.startsWith("..") &&
                !path.isAbsolute(relativePathname);

            return isSubpath && match(vfile);
        });
    if (isEmpty(matched)) return;

    await Promise.all(
        matched.map(async match => {
            match.vfile.value = await safeReadFile(match.vfile.pathname);
            await action(match, match.vfile);
        }),
    );

    const manifest = pipe(
        [...metadataMap.values()],
        sortBy([metadata => dayjs(metadata.created).unix(), "desc"]),
    );

    await safeWriteJson(tempMetadataPath, manifest, isDev ? 2 : undefined);
};

const onCleanup = async () => {
    const promises = pipe(
        tasks,
        map(prop("to")),
        unique(),
        map(to => rm(to)),
    );

    await Promise.all(promises);
};

export const withMdxFileLoader = async (configOrPromise: MaybePromise<NextConfig>) => {
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
