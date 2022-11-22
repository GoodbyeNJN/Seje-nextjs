import fs from "fs";
import path from "path";

import { transformFileSync } from "@swc/core";
import fse from "fs-extra";
import { blogConfig } from "share/config";
import { getClientPath, parseConfig } from "share/utils";

const publicPath = path.resolve(getClientPath(), "public");

const sourceAssetsPath = path.resolve(getClientPath(), "assets");
const targetAssetsPath = path.resolve(getClientPath(), "public/assets");

const { paths: sourceStaticPaths } = parseConfig(blogConfig);
const targetStaticPaths = Object.fromEntries<Config.Paths>(
    Object.entries(blogConfig.paths).map(([key, value]) => [
        key,
        path.resolve(getClientPath(), "public", value),
    ]),
);

const transformFile = (filename: string, path: string) => {
    const compiled = transformFileSync(path, {
        filename,
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: false,
            },
            target: "es2022",
            loose: false,
            minify: {
                compress: { defaults: true },
                mangle: true,
            },
        },
        module: {
            type: "es6",
        },
        minify: true,
    });

    return compiled.code;
};

const clearPublicPath = () => {
    fse.ensureDirSync(publicPath);

    fs.readdirSync(publicPath).forEach(file => {
        if (file !== ".gitkeep") {
            fse.removeSync(path.resolve(publicPath, file));
        }
    });
};

const copyStatics = () => {
    fse.copySync(sourceStaticPaths.favicon, targetStaticPaths.favicon, { overwrite: true });
    fse.copySync(sourceStaticPaths.images, targetStaticPaths.images, {
        overwrite: true,
        recursive: true,
    });
};

const compileAssets = () => {
    fse.ensureDirSync(targetAssetsPath);

    fs.readdirSync(sourceAssetsPath).forEach(file => {
        const { name, ext } = path.parse(file);
        if (ext !== ".ts") {
            return;
        }

        const code = transformFile(file, path.resolve(sourceAssetsPath, file));
        fs.writeFileSync(path.resolve(targetAssetsPath, `${name}.js`), code, { encoding: "utf-8" });
    });
};

const copyAssets = () => {
    fse.ensureDirSync(targetAssetsPath);

    fs.readdirSync(sourceAssetsPath).forEach(file => {
        const { ext } = path.parse(file);
        if (ext === ".ts") {
            return;
        }

        fse.copySync(path.resolve(sourceAssetsPath, file), path.resolve(targetAssetsPath, file), {
            overwrite: true,
        });
    });
};

export const main = () => {
    clearPublicPath();
    copyStatics();
    compileAssets();
    copyAssets();
};
