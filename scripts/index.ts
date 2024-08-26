import * as R from "remeda";

import { clearConsole, clearMarkdownPath, clearPublicPath } from "./clear";
import { copyFiles, watchFiles } from "./copy";
import { generateNextConfig } from "./generator";
import { startNextJs, stopNextJs } from "./nextjs";
import { validateBlogConfig, watchBlogConfig } from "./validation";

const command = process.argv[2] || "dev";
const argv = process.argv.slice(3);

// --preview 参数用于本地编写文章时预览文章效果，包含草稿
// --analyze 参数用于分析构建结果
// --skip-validation 参数用于跳过博客配置文件校验，用于在 CI 环境下快速构建
const args = R.mapValues(
    {
        preview: false,
        analyze: false,
        "skip-validation": false,
    },
    v => {
        const index = argv.indexOf(`--${v}`);
        if (index === -1) {
            return v;
        }

        // 删除参数，防止影响 nextjs 的参数解析
        argv.splice(index, 1);
        return true;
    },
);

const commonOptions = {
    isDev: command === "dev",
    isProd: command !== "dev",
};
const validationOptions = {
    ...commonOptions,
    skip: args["skip-validation"],
};
const copyOptions = {
    ...commonOptions,
    preview: args.preview,
};
const nextOptions = {
    ...commonOptions,
    command,
    argv,
    analyze: args.analyze,
};

const pre = async () => {
    clearConsole();

    const isValidate = await validateBlogConfig(validationOptions);
    watchBlogConfig({
        ...validationOptions,
        onSuccess: async () => {
            // 校验通过，重新开始构建
            await main();
        },
        onFail: async () => {
            // 校验失败，停止 nextjs
            await stopNextJs();
        },
    });

    // 校验通过，开始构建
    isValidate && (await main());
};

const main = async () => {
    clearConsole();

    // 清空 public 和 src/app/(markdowns) 文件夹
    await clearPublicPath(commonOptions);
    await clearMarkdownPath(commonOptions);

    await copyFiles(copyOptions);
    await watchFiles(copyOptions);

    await generateNextConfig({
        ...commonOptions,
        onBuildStart: async () => {
            // console.log("build start:");
            await stopNextJs();
        },
        onBuildEnd: async () => {
            // clearConsole();
            // console.log("build end:");
            startNextJs(nextOptions);
        },
        onRebuildStart: async () => {
            // console.log("rebuild start:");
            // await stopNextJs();
        },
        onRebuildEnd: async () => {
            // clearConsole();
            // console.log("rebuild end:");
            // startNextJs(nextOptions);
        },
    });
};

pre();
