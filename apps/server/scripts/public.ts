import path from "path";

import { transformFile } from "@swc/core";
import chokidar, { type FSWatcher } from "chokidar";
import fse from "fs-extra";
import _ from "lodash";
import { blogConfig, getBlogPaths } from "share/config";
import { getClientPath } from "share/utils";

type Event = "add" | "addDir" | "change" | "unlink" | "unlinkDir";

const transform = async (source: string) => {
    const { base } = path.parse(source);

    const { code } = await transformFile(source, {
        filename: base,
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

    return code;
};

export const clearPublicPath = async () => {
    const publicPath = path.resolve(getClientPath(), "public");

    await fse.ensureDir(publicPath);

    const files = await fse.readdir(publicPath);
    const promises = _.chain(files)
        .without(".gitkeep")
        .map(_.unary(_.partial(path.resolve, publicPath)))
        .map(_.unary(fse.remove))
        .value();

    await Promise.all(promises);
};

const getCopyHandler = (source: string, target: string) => (event: Event, src: string) => {
    const dest = path.resolve(target, path.relative(source, src));

    if (["addDir"].includes(event)) {
        fse.emptyDir(dest);
    }

    if (["add", "change"].includes(event)) {
        fse.copy(src, dest);
    }

    if (["unlink", "unlinkDir"].includes(event)) {
        fse.remove(dest);
    }
};

export const buildStatics = async () => {
    const watchers: FSWatcher[] = [];

    const source = getBlogPaths();
    const target = _.chain(blogConfig.paths)
        .mapValues(_.unary(_.partial(path.resolve, getClientPath(), "public")))
        .value();

    if (await fse.pathExists(source.favicon)) {
        const watcher = chokidar
            .watch(source.favicon)
            .on("all", getCopyHandler(source.favicon, target.favicon));
        watchers.push(watcher);
    }

    if (await fse.pathExists(source.images)) {
        const watcher = chokidar
            .watch(source.images)
            .on("all", getCopyHandler(source.images, target.images));
        watchers.push(watcher);
    }

    return watchers;
};

export const buildAssets = async () => {
    const watchers: FSWatcher[] = [];

    const source = path.resolve(getClientPath(), "assets");
    const target = path.resolve(getClientPath(), "public/assets");

    if (await fse.pathExists(source)) {
        const watcher = chokidar
            .watch(source, { ignored: "**/*.ts" })
            .on("all", getCopyHandler(source, target));
        watchers.push(watcher);

        const tsWatcher = chokidar
            .watch(path.resolve(source, "**/*.ts"))
            .on("all", async (event, src) => {
                const { base, name } = path.parse(src);
                const dest = path.resolve(target, `${name}.js`);

                if (["add", "change"].includes(event)) {
                    const code = await transform(path.resolve(source, base));
                    fse.outputFile(dest, code);
                }

                if (["unlink"].includes(event)) {
                    fse.remove(dest);
                }
            });
        watchers.push(tsWatcher);
    }

    return watchers;
};
