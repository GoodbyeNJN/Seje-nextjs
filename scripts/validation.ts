import fs from "node:fs";
import module from "node:module";

import { generateErrorMessage } from "zod-error";

import { getSchema } from "@/config";
import { createLogger } from "@/utils/logger";
import { getBlogConfigPath, getProjectPath } from "@/utils/path";
import { Watcher } from "@/utils/watcher";

import type { CommonOptions } from "./types";
import type { ErrorMessageOptions } from "zod-error";

export interface Options extends CommonOptions {
    skip?: boolean;
    onSuccess?: () => void;
    onFail?: () => void;
}

const logger = createLogger("[blog-config]");
const require = module.createRequire(getProjectPath());
const blogConfigPath = getBlogConfigPath();

const errorMessageOptions: ErrorMessageOptions = {
    code: {
        enabled: true,
        label: null,
    },
    path: {
        enabled: true,
        type: "objectNotation",
        label: null,
    },
    message: {
        enabled: true,
        label: null,
    },
    delimiter: {
        component: " - ",
        error: "\n",
    },
    transform: ({ codeComponent, pathComponent, messageComponent }) =>
        `[${codeComponent}]: ${pathComponent} - ${messageComponent}.`,
};

let watcher: Watcher | undefined;

export const validateBlogConfig = async (options: Options) => {
    const { skip = false } = options;

    // 强制跳过校验
    if (skip) {
        return true;
    }

    if (!fs.existsSync(blogConfigPath)) {
        logger.error("配置文件不存在，请检查文件路径:", blogConfigPath);
        return false;
    }

    let config;
    try {
        delete require.cache[require.resolve(blogConfigPath)];

        // 这里不能使用 import，因为 import 无法强制刷新缓存
        const module = require(blogConfigPath);
        if (!module) {
            logger.error("获取配置失败，请检查是否默认导出配置对象:", blogConfigPath);
            return false;
        }

        config = module;
    } catch (error) {
        logger.error("配置文件导入失败，请检查文件内容:", blogConfigPath);
        logger.error("错误信息:", error);
        return false;
    }

    const res = getSchema().safeParse(config);
    if (!res.success) {
        const message = generateErrorMessage(res.error.issues, errorMessageOptions);
        logger.error("配置对象校验失败，请检查配置项:", blogConfigPath);
        logger.error("错误信息:", message);
        return false;
    }

    return true;
};

export const watchBlogConfig = (options: Options) => {
    const { skip = false, onSuccess, onFail, isProd } = options;

    // 强制跳过校验时不需要监听
    // 生产模式下不需要监听
    // 已经存在监听器时不需要重复监听
    if (skip || isProd || watcher) return;

    watcher = new Watcher(blogConfigPath);
    watcher
        .on("event", async event => {
            switch (event.type) {
                case "create":
                case "update": {
                    const isValidate = await validateBlogConfig(options);
                    isValidate ? onSuccess?.() : onFail?.();
                    break;
                }

                case "remove": {
                    onFail?.();
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
