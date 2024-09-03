import { watch } from "chokidar";
import { TypedEmitter } from "tiny-typed-emitter";

import { createLogger } from "utils/logger";

import type { FSWatcher } from "chokidar";

type RawEventType = "add" | "addDir" | "change" | "unlink" | "unlinkDir";

export interface WatcherEvents {
    create: (file: string) => void;
    update: (file: string) => void;
    remove: (file: string) => void;
    ready: (files: string[]) => void;

    error: (error: Error) => void;
}

export class Watcher extends TypedEmitter<WatcherEvents> {
    private paths: string[] = [];
    private watcher: FSWatcher;

    constructor(...params: Parameters<typeof watch>) {
        super();

        this.watcher = watch(...params);
        this.watcher.on("add", this.onAdd);
        this.watcher.once("ready", this.onReady);
    }

    add(...params: Parameters<FSWatcher["add"]>) {
        return this.watcher.add(...params);
    }

    close() {
        return this.watcher.close();
    }

    private onAdd = (path: string) => {
        this.paths.push(path);
    };

    private onAll = (rawType: RawEventType, path: string) => {
        if (rawType === "addDir" || rawType === "unlinkDir") return;

        const type = rawType === "add" ? "create" : rawType === "change" ? "update" : "remove";

        this.emit(type, path);
    };

    private onReady = () => {
        this.watcher.off("add", this.onAdd);
        this.watcher.on("all", this.onAll);

        this.emit("ready", this.paths);
    };
}

const logger = createLogger("[watcher]");

let watcher: Watcher;
export const createWatcher = () => {
    if (!watcher) {
        watcher = new Watcher([]);
        watcher.on("error", error => {
            logger.error("监听文件修改失败，请检查错误信息:");
            logger.error(error);
            process.exit(1);
        });
    }

    return watcher;
};
