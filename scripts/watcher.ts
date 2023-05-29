import path from "node:path";

import { transformFile } from "@swc/core";
import fs from "fs-extra";

import {
    blogFaviconPath,
    blogImagePath,
    blogPath,
    projectAssetsPath,
    publicAssetsPath,
    publicFaviconPath,
    publicImagePath,
    publicPath,
} from "@/config/path";
import { isProdEnv } from "@/utils/env";
import { logger } from "@/utils/logger";
import { type Event, Watcher } from "@/utils/watcher";

const transformPath = (filepath: string, from: string, to: string) =>
    path.resolve(to, path.relative(from, filepath));

const compileSrcFileToDestPath = async (src: string, dest: string) => {
    const { base, name } = path.parse(src);

    const { code } = await transformFile(src, {
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

    await fs.outputFile(path.resolve(dest, `${name}.js`), code, "utf8");
};

const onFaviconOrImageEvent = async (type: "favicon" | "image", event: Event) => {
    const blogSrcPath = type === "favicon" ? blogFaviconPath : blogImagePath;
    const publicSrcPath = type === "favicon" ? publicFaviconPath : publicImagePath;

    const copy = async (filepath: string) => {
        const dest = transformPath(filepath, blogSrcPath, publicSrcPath);
        await fs.copy(filepath, dest, { overwrite: true });
        logger.info(`File ${path.relative(blogPath, filepath)} was copied`);
    };

    switch (event.type) {
        case "ready": {
            const isDir =
                (await fs.exists(publicSrcPath)) && (await fs.lstat(publicSrcPath)).isDirectory();
            if (isDir) {
                await fs.emptyDir(publicSrcPath);
            }

            await Promise.all(event.paths.map(copy));
            break;
        }
        case "create":
        case "update": {
            await copy(event.path);
            break;
        }
        case "remove": {
            const dest = transformPath(event.path, blogSrcPath, publicSrcPath);
            await fs.remove(dest);
            logger.info(`File ${path.relative(blogPath, event.path)} was deleted`);
            break;
        }
    }
};

const onAssetsEvent = async (event: Event) => {
    const compileOrCopy = async (filepath: string) => {
        const { ext } = path.parse(filepath);
        const dest = transformPath(filepath, projectAssetsPath, publicAssetsPath);
        const logPath = path.relative(process.env.APP_PATH, filepath);

        if (ext === ".ts") {
            await compileSrcFileToDestPath(filepath, publicAssetsPath);
            logger.info(`File ${logPath} was compiled`);
        } else {
            await fs.copy(filepath, dest, { overwrite: true });
            logger.info(`File ${logPath} was copied`);
        }
    };

    switch (event.type) {
        case "ready": {
            await Promise.all(event.paths.map(compileOrCopy));
            break;
        }
        case "create":
        case "update": {
            await compileOrCopy(event.path);
            break;
        }
        case "remove": {
            const dest = transformPath(event.path, projectAssetsPath, publicAssetsPath);
            await fs.remove(dest);
            logger.info(`File ${path.relative(process.env.APP_PATH, event.path)} was deleted`);
            break;
        }
    }
};

// 清空 public 文件夹但保留 .gitkeep 文件
await fs.remove(publicPath);
await fs.createFile(path.resolve(publicPath, ".gitkeep"));

logger.info("Start watching files...");

// 开启路径监听
const faviconWatcher = new Watcher(blogFaviconPath).on("event", async event => {
    await onFaviconOrImageEvent("favicon", event);

    if (isProdEnv && event.type === "ready") {
        await faviconWatcher.close();
        logger.info("Watching favicon files has stopped");
    }
});

const imageWatcher = new Watcher(blogImagePath).on("event", async event => {
    await onFaviconOrImageEvent("image", event);

    if (isProdEnv && event.type === "ready") {
        await imageWatcher.close();
        logger.info("Watching image files has stopped");
    }
});

const assetsWatcher = new Watcher(projectAssetsPath).on("event", async event => {
    await onAssetsEvent(event);

    if (isProdEnv && event.type === "ready") {
        await assetsWatcher.close();
        logger.info("Watching assets files has stopped");
    }
});
