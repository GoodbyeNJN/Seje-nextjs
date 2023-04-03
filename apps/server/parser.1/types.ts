import type { GrayMatterFile } from "gray-matter";

// declare global {
namespace Parser {
    interface RemoveEvent {
        name: "remove";
        path: string;
    }

    interface CreateUpdateEvent {
        name: "create" | "update";
        path: string;
        mtime?: Date;
    }

    type Event = RemoveEvent | CreateUpdateEvent;
    type EventName = "create" | "update" | "remove";

    interface File {
        path: string;
        mtime: string;
        hash: string;
        content: unknown;
    }

    type Cache = Omit<File, "content">;

    interface RawFile extends File {
        content: GrayMatterFile<string>;
    }

    interface PostFile extends File {
        content: PostFileContent;
    }

    interface PostFileContent {
        hash: string;
        title: string;
        slug: string;
        date: string;
        categories: CategoryOrTag[];
        tags: CategoryOrTag[];
        content: string;
        excerpt: string;
    }

    interface CategoryOrTag {
        hash: string;
        content: string;
    }

    interface PageFile extends File {
        content: PageFileContent;
    }

    interface PageFileContent {
        hash: string;
        title: string;
        slug: string;
        content: string;
    }

    interface FileMap {
        posts: PostFile[];
        pages: PageFile[];
    }

    interface CacheDiff<T extends File = File> {
        create: T[];
        remove: Cache[];
        update: T[];
    }

    interface CacheMap {
        posts: CacheDiff<PostFile>;
        pages: CacheDiff<PageFile>;
    }
}
// }

export {};
