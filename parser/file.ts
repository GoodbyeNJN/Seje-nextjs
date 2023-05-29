import path from "node:path";

import dayjs from "dayjs";
import fs from "fs-extra";
import matter from "gray-matter";
import walkdir from "walkdir";
import { parse, stringify } from "yaml";

import { blogMarkdownPath } from "@/config/path";
import { getHash } from "@/utils/hash";
import { joinPathname } from "@/utils/url";

import type { PageMarkdown, PostMarkdown } from "./types";

let MARKDOWN_CACHE: Record<string, PostMarkdown | PageMarkdown> = {};

/** 解析所有 markdown 文件内容，结果以创建时间倒序排列 */
export const parseFile = async () => {
    const filepaths = (await walkdir.async(blogMarkdownPath)).filter(filepath =>
        [".md", ".mdx"].includes(path.extname(filepath)),
    );

    const markdowns: (PostMarkdown | PageMarkdown)[] = [];
    for (const filepath of filepaths) {
        const file = await fs.readFile(filepath, "utf8");
        const relativePath = path
            .relative(blogMarkdownPath, filepath)
            .replace(path.extname(filepath), "");

        const hash = getHash(file);
        const cache = MARKDOWN_CACHE[hash];
        if (cache) {
            markdowns.push(cache);
            continue;
        }

        const { data, excerpt, content } = matter(file, {
            excerpt: true,
            engines: { yaml: { parse, stringify } },
        });
        const {
            type = "post",
            draft = false,
            title = "",
            created = "1970-01-01",
            updated = created,
            description = "",
            permalink = encodeURI(joinPathname(relativePath)),
            categories = [],
            tags = [],
        } = data;
        if (draft) {
            continue;
        }

        const markdown: PostMarkdown | PageMarkdown = {
            type,
            draft,
            title,
            created: dayjs(created),
            updated: dayjs(updated),
            description,
            permalink,
            categories: categories.map((slug: string) => ({
                slug,
                permalink: encodeURI(`/categories/${slug}`),
            })),
            tags: tags.map((slug: string) => ({
                slug,
                permalink: encodeURI(`/tags/${slug}`),
            })),
            excerpt: excerpt || content,
            content,
        };

        MARKDOWN_CACHE[hash] = markdown;
        markdowns.push(markdown);
    }

    markdowns.sort((a, b) => b.created.unix() - a.created.unix());

    return markdowns;
};
