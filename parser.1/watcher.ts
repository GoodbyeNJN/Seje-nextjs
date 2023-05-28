import { watch } from "chokidar";
import { TypedEmitter } from "tiny-typed-emitter";

import type { FSWatcher } from "chokidar";

type RawEventType = "add" | "addDir" | "change" | "unlink" | "unlinkDir";

type EventType = "ready" | "create" | "update" | "remove";

export type Event =
    | { type: Exclude<EventType, "ready">; path: string }
    | { type: "ready"; paths: string[] };

export interface WatcherEvents {
    event: (event: Event) => void;
}

export class Watcher extends TypedEmitter<WatcherEvents> {
    private paths: string[] = [];
    private watcher: FSWatcher;

    public constructor(...params: Parameters<typeof watch>) {
        super();

        this.watcher = watch(...params);
        this.watcher.on("add", this.onAdd);
        this.watcher.once("ready", this.onReady);
    }

    public close() {
        return this.watcher.close();
    }

    private onAdd = (path: string) => {
        this.paths.push(path);
    };

    private onAll = (rawType: RawEventType, path: string) => {
        if (rawType === "addDir" || rawType === "unlinkDir") {
            return;
        }

        const type = rawType === "add" ? "create" : rawType === "change" ? "update" : "remove";

        this.emit("event", { type, path });
    };

    private onReady = () => {
        this.watcher.off("add", this.onAdd);
        this.watcher.on("all", this.onAll);

        this.emit("event", { type: "ready", paths: this.paths });
    };
}
