import path from "path";

import dayjs from "dayjs";
import fse from "fs-extra";
import matter from "gray-matter";
import _ from "lodash";
import { db } from "server/db";
import { getBlogPath } from "share/utils";
import { parse, stringify } from "yaml";

import { readFile } from "./file";

// export const parseEvent = async (event: Parser.Event) => {
//     const { name } = event;
//     const absolutePath = event.path;
//     const relativePath = path.relative(getBlogPath(), absolutePath);
//     const mtime = dayjs(event.mtime || (await getFileMTime(absolutePath))).format();

//     if (name === "remove") {
//         // 删除
//         return;
//     }

//     const { hash, content } = await readFile(absolutePath);

//     if (name === "update") {
//         const cache = await db.getCacheByPath(relativePath);
//         if (!cache) {
//             return;
//         }

//         if (
//             (process.env.WATCH_MODE && cache.mtime === mtime) ||
//             (!process.env.WATCH_MODE && cache.hash === hash)
//         ) {
//             // 监听模式下，最后修改时间一致，跳过
//             // 非监听模式下，hash 一致，跳过
//             return;
//         }
//     }

//     const raw: Parser.RawFile = { path: relativePath, mtime, hash, content };
//     const parsedContent = matter(content, {
//         excerpt: true,
//         engines: { yaml: { parse, stringify } },
//     });
// };

export const create = async (event: Parser.Event) => {
    const { path: absolutePath, mtime } = event;
    const relativePath = path.relative(getBlogPath(), absolutePath);
    const { hash, content } = await readFile(absolutePath);
};

export const update = async (event: Parser.Event) => {
    const { path: absolutePath, mtime } = event;
    const relativePath = path.relative(getBlogPath(), absolutePath);
    const { hash, content } = await readFile(absolutePath);

    const cache = await db.getCacheByPath(relativePath);
    if (!cache) {
        return;
    }

    if (
        (process.env.WATCH_MODE && cache.mtime === mtime) ||
        (!process.env.WATCH_MODE && cache.hash === hash)
    ) {
        // 监听模式下，最后修改时间一致，跳过
        // 非监听模式下，hash 一致，跳过
        return;
    }
};

/**
 * 删除文件
 */
export const remove = async (event: Parser.Event) => {
    // 获取缓存，如果获取不到缓存，跳过
    const caches = await db.deleteCacheByPath(event.path);
    if (caches.length === 0) {
        return;
    }

    const { hash } = caches[0];

    // 删除 page
    if (event.type === "page") {
        await db.deletePageById(hash);
        return;
    }

    // 删除 post，如果没有删除任何 post，跳过
    const posts = await db.deletePostById(hash);
    if (posts.length === 0) {
        return;
    }

    // 获取已删除 post 对应的 categories 和 tags
    const [post] = posts;
    const categories = await db.getCategoriesByPostId(post.id);
    const tags = await db.getTagsByPostId(post.id);

    // 删除 post 和 category 的关联
};
