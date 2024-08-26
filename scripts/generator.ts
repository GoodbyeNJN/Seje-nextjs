import path from "node:path";

import { build, context } from "esbuild";
import Unimport from "unimport/unplugin";

import { createLogger } from "@/utils/logger";
import { getProjectPath } from "@/utils/path";

import type { CommonOptions } from "./types";
import type { BuildContext, BuildOptions } from "esbuild";

export interface Options extends CommonOptions {
    onBuildStart?: () => void | Promise<void>;
    onBuildEnd?: () => void | Promise<void>;
    onRebuildStart?: () => void | Promise<void>;
    onRebuildEnd?: () => void | Promise<void>;
}

const logger = createLogger("[next-config]");

const tsFilename = "next.config.ts";
const jsFilename = "next.config.mjs";

const tsFilepath = path.resolve(getProjectPath(), tsFilename);
const jsFilepath = path.resolve(getProjectPath(), jsFilename);

let ctx: BuildContext<BuildOptions> | undefined;
let isRebuild = false;

export const generateNextConfig = async (options: Options) => {
    const { onBuildStart, onBuildEnd, onRebuildStart, onRebuildEnd, isProd, isDev } = options;

    const buildOptions: BuildOptions = {
        bundle: true,
        platform: "node",

        entryPoints: [tsFilepath],

        format: "esm",

        outfile: jsFilepath,

        packages: "external",

        target: ["esnext"],

        define: {
            "import.meta.env.DEV": JSON.stringify(isDev),
            "import.meta.env.PROD": JSON.stringify(isProd),
            "import.meta.env.SSR": JSON.stringify(`typeof window === "undefined"`),
        },
        minify: false,
        treeShaking: true,

        plugins: [
            Unimport.esbuild({
                imports: [{ name: "*", as: "R", from: "remeda" }],
            }),

            {
                name: "build-hook",
                setup(build) {
                    build.onStart(async () => {
                        await (isRebuild ? onRebuildStart?.() : onBuildStart?.());
                    });
                    build.onEnd(async () => {
                        await (isRebuild ? onRebuildEnd?.() : onBuildEnd?.());
                        isRebuild = true;
                    });
                },
            },

            {
                // 用于解析 @/blog/config 为外部依赖
                name: "resolve-blog-config",
                setup(build) {
                    build.onResolve({ filter: /^@\/blog\/config$/ }, () => ({
                        path: "./blog/config.js",
                        external: true,
                        pluginData: { isFromOnResolve: true },
                    }));
                },
            },
        ],
    };

    try {
        // 生产环境下直接编译
        if (isProd) {
            await build(buildOptions);
            return;
        }

        // 先解除监听
        ctx && (await ctx.dispose());
        // 再重新监听
        ctx = await context(buildOptions);
        await ctx.watch();
    } catch (error) {
        logger.error("编译文件失败，请检查错误信息:");
        logger.error(error);
        process.exit(1);
    }
};
