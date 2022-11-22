import path from "path";

import dayjs from "dayjs";
import fse from "fs-extra";
import matter from "gray-matter";
import _ from "lodash";
import { getBlogPaths } from "share/config";
import { getBlogPath, getHash, isArray, isString } from "share/utils";
import walkdir from "walkdir";
import { parse, stringify } from "yaml";

const walk = async (filepath: string) => {
    const paths = await walkdir.async(filepath, { return_object: true });
    const promises = _.chain(paths)
        .entries()
        .filter(([filepath, stat]) => stat.isFile() && path.extname(filepath) === ".md")
        .map(async ([filepath, stat]) => {
            const content = await fse.readFile(filepath, "utf-8");
            const file: Parser.RawFile = {
                path: path.relative(getBlogPath(), filepath),
                mtime: dayjs(stat.mtime).format(),
                hash: getHash(content),
                content: matter(content, {
                    excerpt: true,
                    engines: { yaml: { parse, stringify } },
                }),
            };
            return file;
        })
        .value();

    return await Promise.all(promises);
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

export const parseFiles = async (): Promise<Parser.FileMap> => {
    const paths = getBlogPaths();

    const posts = (await walk(paths.posts)).map<Parser.PostFile>(file => ({
        ...file,
        content: parsePostFile(file),
    }));
    const pages = (await walk(paths.pages)).map<Parser.PageFile>(file => ({
        ...file,
        content: parsePageFile(file),
    }));

    return { posts, pages };
};
