import { existsSync } from "fs";

import { generateErrorMessage } from "zod-error";

import { blogConfigPath } from "server/constants";
import { getValuesFromProcessEnv } from "server/utils/env";
import { createDebugger } from "utils/debug";
import { readJsonSync } from "utils/fs";
import { createLogger } from "utils/logger";

import { defaultBlogConfig } from "./default-config";
import { schema } from "./schema";

import type { BlogConfig } from "./schema";
import type { ZodError } from "zod";

const logger = createLogger("[blog-config-validator]");
const debug = createDebugger("[blog-config-validator]");
const { isProd, skipValidation } = getValuesFromProcessEnv();

const validate = () => {
    let blogConfig = defaultBlogConfig;

    if (!existsSync(blogConfigPath)) {
        logger.error("配置文件不存在，请检查文件路径:", blogConfigPath);
        process.exit(1);
    }

    try {
        blogConfig = readJsonSync<BlogConfig>(blogConfigPath);
    } catch {
        logger.error("配置文件解析失败，请检查文件内容:", blogConfigPath);

        if (isProd) process.exit(1);

        return blogConfig;
    }

    if (skipValidation) return blogConfig;

    try {
        blogConfig = schema.parse(blogConfig);
    } catch (error) {
        const message = generateErrorMessage((error as ZodError).issues, {
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
        });

        logger.error("配置项校验失败，请检查错误信息:");
        logger.error(message);

        if (isProd) process.exit(1);

        return blogConfig;
    }

    return blogConfig;
};

let cachedBlogConfig = defaultBlogConfig;
export const getBlogConfig = (skipValidation = true) => {
    if (!skipValidation) {
        debug.start("Validate blog config");

        cachedBlogConfig = validate();

        debug.end("Validate blog config");
    }

    return cachedBlogConfig;
};
