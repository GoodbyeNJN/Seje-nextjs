import userBlogConfig from "blog/config";
import deepmerge from "deepmerge";

import { defaultBlogConfig } from "./default";

export const blogConfig: Config.Blog = deepmerge(defaultBlogConfig, userBlogConfig);

if (userBlogConfig.menu) {
    blogConfig.menu = userBlogConfig.menu;
}

if (userBlogConfig.code.theme) {
    blogConfig.code.theme = userBlogConfig.code.theme;
}
