import path from "path";

import concurrently, { type ConcurrentlyCommandInput } from "concurrently";
import { getBasePath, getSiteUrl } from "share/utils";

const [, currentPath, subCommand] = process.argv;
const APP_ROOT_PATH = path.resolve(currentPath, "../..");
const BASE_PATH = getBasePath();
const SITE_URL = getSiteUrl();
const ANALYZE = false;
const env = { APP_ROOT_PATH, BASE_PATH, SITE_URL };

const server = "apps/server";
const client = "apps/client";

const commands: Record<string, ConcurrentlyCommandInput[]> = {
    dev: [
        {
            name: "server",
            prefixColor: "blue",
            env,
            command: `npm:build watch -w ${server}`,
        },
        {
            name: "client",
            prefixColor: "green",
            env,
            command: `npm:dev -w ${client}`,
        },
    ],
    prebuild: [
        {
            name: "server",
            prefixColor: "blue",
            env,
            command: `npm:build -w ${server}`,
        },
    ],
    build: [
        {
            name: "client",
            prefixColor: "green",
            env: { ...env, ANALYZE },
            command: `npm:build -w ${client} && npm:export -w ${client}`,
        },
    ],
};

concurrently(commands[subCommand]);
