import path from "node:path";
import url from "node:url";

import chalk from "chalk";
import concurrently from "concurrently";

import { createLogger } from "@/utils/logger";

import type { ConcurrentlyCommandInput } from "concurrently";

if (!process.env.SKIP_CONFIG_VALIDATION) {
    const logger = createLogger(chalk.green("[validate]"));

    try {
        await import("../config/validation");
    } catch (error) {
        logger.error("Blog config validation failed!");

        if (error instanceof Error) {
            error.message.split("\n").forEach(line => logger.error(line));
        }

        process.exit(1);
    }
}

type SubCommand = "dev" | "prebuild" | "build";

const thisFilePath = process.argv[1] || url.fileURLToPath(import.meta.url);
const subCommand = (process.argv[2] || "dev") as SubCommand;
const argv = process.argv.slice(3);

const { getBasePath } = await import("@/config");
const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: subCommand !== "dev" ? "production" : "development",
    APP_PATH: path.resolve(path.dirname(thisFilePath)),
    BASE_PATH: getBasePath(),
    BUNDLE_ANALYZE: argv.includes("--analyze") ? "true" : "false",
};

const commands: Record<SubCommand, ConcurrentlyCommandInput[]> = {
    dev: [
        {
            name: "watcher",
            env,
            command: "npx tsx scripts/watcher.ts",
            prefixColor: "blue",
        },
        {
            name: "next",
            env,
            command: "npx next dev",
            prefixColor: "green",
        },
    ],
    prebuild: [
        {
            name: "watcher",
            env,
            command: "npx tsx scripts/watcher.ts",
            prefixColor: "blue",
        },
    ],
    build: [
        {
            name: "next",
            env,
            command: "npx next build",
            prefixColor: "green",
        },
    ],
};

concurrently(commands[subCommand]);
