import path from "node:path";
import url from "node:url";

import chalk from "chalk";
import concurrently from "concurrently";
import _ from "lodash";

import { createLogger } from "@/utils/logger";

import type { ConcurrentlyCommandInput } from "concurrently";

if (!process.env.SKIP_CONFIG_VALIDATION) {
    const logger = createLogger(chalk.green("[validate]"));

    try {
        await import("./config/validation");
    } catch (error) {
        logger.error("Blog config validation failed!");

        if (error instanceof Error) {
            error.message.split("\n").forEach(_.unary(logger.error));
        }

        process.exit(1);
    }
}

type SubCommand = "dev" | "prebuild" | "build";

const appFilePath = process.argv[1] || url.fileURLToPath(import.meta.url);
const subCommand = (process.argv[2] || "dev") as SubCommand;
const argv = process.argv.slice(3);

const { blogConfig } = await import("@/config");
const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: subCommand !== "dev" ? "production" : "development",
    BLOG_PATH: path.resolve(path.dirname(appFilePath), "blog"),
    BASE_PATH: new URL(blogConfig.permalink.site).pathname,
    BUNDLE_ANALYZE: argv.includes("--analyze") ? "true" : "false",
};

const commands: Record<SubCommand, ConcurrentlyCommandInput[]> = {
    dev: [
        {
            name: "server",
            env,
            command: "nodemon ./parser/process.ts -w ./parser -e ts -x 'npx tsx' -I -q",
            prefixColor: "blue",
        },
        {
            name: "client",
            env,
            command: "npx next dev",
            prefixColor: "cyan",
        },
    ],
    prebuild: [
        {
            name: "server",
            env,
            command: "npx tsx ./parser/process.ts",
            prefixColor: "blue",
        },
    ],
    build: [
        {
            name: "client",
            env,
            command: "npx next build",
            prefixColor: "cyan",
        },
    ],
};

concurrently(commands[subCommand]);
