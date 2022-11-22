import path from "path";

import concurrently from "concurrently";
import { getBasePath, getSiteUrl } from "share/utils";

import type { ConcurrentlyCommandInput } from "concurrently";

const [, currentPath, subCommand] = process.argv;
const APP_ROOT_PATH = path.resolve(currentPath, "../..");
const BASE_PATH = getBasePath();
const SITE_URL = getSiteUrl();
const ANALYZE = false;
const env = { APP_ROOT_PATH, BASE_PATH, SITE_URL };

const server = "apps/server";
const client = "apps/client";
const blog = "blog";

const commands: Record<string, ConcurrentlyCommandInput[]> = {
    dev: [
        {
            name: "server",
            env,
            command: `npx chokidar "${blog}/**/*" "${client}/assets/**/*.ts" "${server}/**/*.ts" -c "npm -w ${server} run build" --initial --silent`,
        },
        {
            name: "client",
            env,
            command: `npm -w ${client} run dev`,
        },
    ],
    prebuild: [
        {
            name: "server",
            env,
            command: `npm -w ${server} run build`,
        },
    ],
    build: [
        {
            name: "client",
            env: { ...env, ANALYZE },
            command: `npm -w ${client} run build && npm -w ${client} run export`,
        },
    ],
    serve: [
        {
            name: "client",
            env,
            command: `npx serve ${client}/out`,
        },
    ],
};

concurrently(commands[subCommand], {
    prefixColors: ["green"],
});
