import crypto from "node:crypto";
import path from "node:path";

import fs from "fs-extra";
import matter from "gray-matter";
import { parse, stringify } from "yaml";

import { isArray, isString } from "@/utils/type";

import type { PageFile, PostFile, RawFile } from "./types";

const getHash = (str: string, length = 16) =>
    crypto.createHash("shake256", { outputLength: length }).update(str).digest("hex");

export const parseFile = async (filePath: string): Promise<RawFile> => {
    const absolutePath = path.resolve(process.env.BLOG_PATH, filePath);
    const file = await fs.readFile(absolutePath, "utf-8");
    const { data, excerpt, content } = matter(file, {
        excerpt: true,
        engines: { yaml: { parse, stringify } },
    });
    const fileHash = getHash(file);
    const contentHash = getHash(content);

    return {
        filePath,
        fileHash,
        contentHash,
        data,
        excerpt,
        content,
    };
};

export const parseCategoryOrTag = (raw: unknown) => {
    const array = isString(raw)
        ? [raw]
        : isArray(raw)
        ? raw.map(item => (isString(item) ? item : ""))
        : [];

    return array;
};

export const parsePostFile = (file: RawFile): PostFile => {
    const { data = {}, ...rest } = file;
    const title = String(data.title || "");
    const slug = String(data.slug || "");
    const date = String(data.date || "1970-01-01T08:00:00+08:00");
    const categories = parseCategoryOrTag(data.categories);
    const tags = parseCategoryOrTag(data.tags);

    return { ...rest, title, slug, date, categories, tags };
};

export const parsePageFile = (file: RawFile): PageFile => {
    const { data = {}, ...rest } = file;
    const title = String(data.title || "");
    const slug = String(data.slug || "");

    return { ...rest, title, slug };
};
