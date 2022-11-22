import type { Client as DbClient } from "./client";

declare global {
    namespace Db {
        type Client = DbClient;

        interface LowDb<T = unknown> {
            data: T;
            read: () => Promise<void>;
            write: () => Promise<void>;
        }

        interface Page {
            id: string;
            title: string;
            slug: string;
            link: string;
            content: string;
        }

        interface Post {
            id: string;
            title: string;
            slug: string;
            date: string;
            link: string;
            excerpt: string;
            content: string;
        }

        interface Category {
            id: string;
            slug: string;
            link: string;
        }

        interface Tag {
            id: string;
            slug: string;
            link: string;
        }

        type PostsCategoriesMap = Record<string, string[]>;
        type PostsTagsMap = Record<string, string[]>;

        interface Blog {
            pages: Page[];

            posts: Post[];
            categories: Category[];
            tags: Tag[];

            postsCategoriesMap: PostsCategoriesMap;
            postsTagsMap: PostsTagsMap;
        }

        type Cache = Parser.Cache;

        interface Additional {
            caches: Cache[];
        }

        type Db = Blog & Additional;
    }
}

export {};
