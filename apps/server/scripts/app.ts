import { type FSWatcher } from "chokidar";

import { buildMarkdown } from "./parse";
import { buildAssets, buildStatics, clearPublicPath } from "./public";

const [, , mode] = process.argv;
const isWatchMode = mode === "watch";

const main = async () => {
    await clearPublicPath();

    const watchers: FSWatcher[] = [];

    watchers.concat(await buildStatics());
    watchers.concat(await buildAssets());

    watchers.concat(await buildMarkdown(isWatchMode));

    if (!isWatchMode) {
        watchers.forEach(watcher => watcher.on("ready", () => watcher.close()));
    }
};

main();
