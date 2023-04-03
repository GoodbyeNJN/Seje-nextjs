import path from "path";

import dayjs from "dayjs";
import fse from "fs-extra";
import matter from "gray-matter";
import _ from "lodash";
import { getBlogConfigPaths } from "share/config";
import { getBlogPath, getHash, isArray, isString } from "share/utils";
import walkdir from "walkdir";
import { parse, stringify } from "yaml";

export const readFile = async (filepath: string) => {
    const content = await fse.readFile(filepath, "utf-8");
    const hash = getHash(content);
    return { hash, content };
};

const parseCategoryOrTag = (raw: unknown) => {
    const array = isString(raw)
        ? [raw]
        : isArray(raw)
        ? raw.map(item => (isString(item) ? item : ""))
        : [];

    return array.map<Parser.CategoryOrTag>(item => ({
        hash: getHash(item),
        content: item,
    }));
};

const parsePostFile = (file: Parser.RawFile): Parser.PostFileContent => {
    const { data = {}, content = "" } = file.content;
    const excerpt = file.content.excerpt || content;
    const { title = "", slug = "", date = "1970-01-01T08:00:00+08:00" } = data;
    const categories = parseCategoryOrTag(data.categories);
    const tags = parseCategoryOrTag(data.tags);
    const hash = getHash(content);

    return { hash, title, slug, date, categories, tags, content, excerpt };
};

const parsePageFile = (file: Parser.RawFile): Parser.PageFileContent => {
    const { data = {}, content = "" } = file.content;
    const { title = "", slug = "" } = data;
    const hash = getHash(content);

    return { hash, title, slug, content };
};

export const parseFiles = async (filepath: string) => {
    const content = await fse.readFile(filepath, "utf-8");
    const hash = getHash(content);

    return { hash, content };
};
