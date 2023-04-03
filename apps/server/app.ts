import { type FSWatcher } from "chokidar";

import {
    buildMarkdown,
    clearPublicPath,
    copyImageFiles,
    copyScriptFiles,
    parseMarkdownFiles,
} from "./watcher";

const main = async () => {
    await clearPublicPath();

    const watchers: FSWatcher[] = [];

    watchers.concat(await copyImageFiles());
    watchers.concat(await copyScriptFiles());

    watchers.concat(await parseMarkdownFiles());
    // watchers.concat(await buildMarkdown());

    // 非监听模式下立即取消监听
    if (!process.env.WATCH_MODE) {
        watchers.forEach(watcher => watcher.on("ready", () => watcher.close()));
    }
};

main();
