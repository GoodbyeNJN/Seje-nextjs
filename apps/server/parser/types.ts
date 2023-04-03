import type { GrayMatterFile } from "gray-matter";

declare global {
    namespace Parser {
        type FileType = "post" | "page";

        type EventName = "create" | "update" | "remove";

        interface Event {
            name: EventName;
            type: FileType;
            path: string;
            mtime: string;
        }

        interface File {
            type: FileType;
            path: string;
            mtime: string;
            hash: string;
            content: unknown;
        }

        type CacheFile = Omit<File, "content">;

        interface RawFile extends File {
            content: string;
        }
    }
}

export {};
