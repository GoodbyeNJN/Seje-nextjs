import path from "path";

import chokidar, { type FSWatcher } from "chokidar";
import fse from "fs-extra";
import _ from "lodash";
import { blogConfig, getBlogConfigPaths } from "share/config";
import { getClientPath } from "share/utils";

import { getCommonFileListener, getTsFileListener } from "./listener";

/**
 * 清空 client/public 目录
 */
export const clearPublicPath = async () => {
    const publicPath = path.resolve(getClientPath(), "public");

    await fse.ensureDir(publicPath);

    const files = await fse.readdir(publicPath);
    const promises = _.chain(files)
        .without(".gitkeep")
        .map(filepath => path.resolve(publicPath, filepath))
        .map(filepath => fse.remove(filepath))
        .value();

    await Promise.all(promises);
};

/**
 * 复制图片到 client/public 目录
 */
export const copyImageFiles = async () => {
    const watchers: FSWatcher[] = [];

    const source = getBlogConfigPaths();
    const target = _.chain(blogConfig.paths)
        .mapValues(config => path.resolve(getClientPath(), "public", config))
        .value();

    if (await fse.pathExists(source.favicon)) {
        watchers.push(
            chokidar
                .watch(source.favicon)
                .on("all", getCommonFileListener(source.favicon, target.favicon)),
        );
    }

    if (await fse.pathExists(source.images)) {
        watchers.push(
            chokidar
                .watch(source.images)
                .on("all", getCommonFileListener(source.images, target.images)),
        );
    }

    return watchers;
};

/**
 * 复制脚本到 client/public/scripts 目录，并编译 ts 文件
 */
export const copyScriptFiles = async () => {
    const watchers: FSWatcher[] = [];

    const source = path.resolve(getClientPath(), "scripts");
    const target = path.resolve(getClientPath(), "public/scripts");

    if (await fse.pathExists(source)) {
        watchers.push(
            chokidar
                .watch(source, { ignored: "**/*.ts" })
                .on("all", getCommonFileListener(source, target)),
        );

        watchers.push(
            chokidar
                .watch(path.resolve(source, "**/*.ts"))
                .on("all", getTsFileListener(source, target)),
        );
    }

    return watchers;
};
