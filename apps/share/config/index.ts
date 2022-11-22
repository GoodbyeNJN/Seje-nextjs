import path from "path";

import userBlogConfig from "blog/config";
import deepmerge from "deepmerge";
import { getBlogPath } from "share/utils";

import { defaultBlogConfig } from "./default";

export const blogConfig: Config.Blog = deepmerge(defaultBlogConfig, userBlogConfig);

if (userBlogConfig.menu) {
    blogConfig.menu = userBlogConfig.menu;
}

if (userBlogConfig.code.theme) {
    blogConfig.code.theme = userBlogConfig.code.theme;
}

let paths: Config.Paths;
export const getBlogPaths = () => {
    if (paths) {
        return paths;
    }

    paths = { ...blogConfig.paths };

    paths = Object.fromEntries<Config.Paths>(
        Object.entries(blogConfig.paths).map(([key, value]) => [
            key,
            path.resolve(getBlogPath(), value),
        ]),
    );

    return paths;
};
