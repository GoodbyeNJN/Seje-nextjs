import path from "path";

import userBlogConfig from "blog/config";
import deepmerge from "deepmerge";
import _ from "lodash";
import { getBlogPath } from "share/utils";

import { defaultBlogConfig } from "./default";

export const blogConfig: Config.Blog = deepmerge(defaultBlogConfig, userBlogConfig);

if (userBlogConfig.menu) {
    blogConfig.menu = userBlogConfig.menu;
}

if (userBlogConfig.code.theme) {
    blogConfig.code.theme = userBlogConfig.code.theme;
}

export const getBlogConfigPaths = () =>
    _.chain(blogConfig.paths)
        .mapValues(config => path.resolve(getBlogPath(), config))
        .value();
