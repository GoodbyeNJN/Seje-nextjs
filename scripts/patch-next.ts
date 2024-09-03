#!/usr/bin/env tsx

import path from "node:path";

import { $ } from "zx";

import { blogConfigPath, rootPath } from "server/constants";
import { rm, safeReadFile, safeWriteFile } from "utils/fs";

const temp = path.resolve(import.meta.dirname, "../.temp/next");

await rm(temp);
await $`pnpm patch next --edit-dir ${temp}`;

const patches = [
    {
        filepath: "dist/build/next-config-ts/transpile-config.js",
        handler: (content: string) => {
            const code = `
async function transpileConfig({ nextConfigPath, cwd }) {
    const { tsImport } = await import('tsx/esm/api');

    const module = await tsImport(nextConfigPath, __filename);

    return module;
}
`;

            return content.replace(
                "async function transpileConfig({ nextConfigPath, cwd }) {",
                `${code}async function _transpileConfig({ nextConfigPath, cwd }) {`,
            );
        },
    },
    {
        filepath: "dist/server/lib/start-server.js",
        handler: (content: string) => {
            const relative = path.relative(rootPath, blogConfigPath);

            return content.replace(
                "files: _constants.CONFIG_FILES.map((file)=>_path.default.join(dirToWatch, file))",
                `files: _constants.CONFIG_FILES.concat('${relative}').map((file)=>_path.default.join(dirToWatch, file))`,
            );
        },
    },
];

for (const patch of patches) {
    const filepath = path.resolve(temp, patch.filepath);
    const content = await safeReadFile(filepath);

    if (!content) {
        console.error(`File not exits or empty: ${filepath}`);
        await rm(temp);

        process.exit(1);
    }

    const patched = patch.handler(content);
    await safeWriteFile(filepath, patched);
}

await $`pnpm patch-commit --patches-dir ./scripts/patches ${temp}`;
await rm(temp);

console.log("Patched files successfully");
