import fs from "fs";
import path from "path";

import matter from "gray-matter";
import walkdir from "walkdir";
import { parse, stringify } from "yaml";

export const parsePostFiles = (config: Config.Blog) =>
    walkdir
        .sync(config.paths.posts)
        .filter(file => path.extname(file) === ".md")
        .map(path => fs.readFileSync(path, { encoding: "utf8" }))
        .map(content =>
            matter(content, {
                excerpt: true,
                engines: { yaml: { parse, stringify } },
            }),
        )
        .map<Parser.PostFileContent>(raw => {
            const { data = {}, content = "", excerpt = "" } = raw;
            const {
                title = "",
                slug = "",
                date = "1970-01-01T08:00:00+08:00",
                categories = [],
                tags = [],
            } = data;
            return {
                data: { title, slug, date, categories, tags },
                content,
                excerpt: excerpt || content,
            };
        });

export const parsePageFiles = (config: Config.Blog) =>
    walkdir
        .sync(config.paths.pages)
        .filter(file => file.endsWith(".md"))
        .map(path => fs.readFileSync(path, { encoding: "utf8" }))
        .map(content =>
            matter(content, {
                excerpt: true,
                engines: { yaml: { parse, stringify } },
            }),
        )
        .map<Parser.PageFileContent>(raw => {
            const { data = {}, content = "" } = raw;
            const { title = "", slug = "", date = "1970-01-01T08:00:00+08:00" } = data;
            return {
                data: { title, slug, date },
                content,
            };
        });
