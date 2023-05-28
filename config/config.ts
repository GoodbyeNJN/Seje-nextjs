import userBlogConfig from "@/blog/config";

import type { UserConfig } from "./schema";

export const defaultBlogConfig: UserConfig = {
    title: "Yet Another Blog",
    subtitle: "Yet another blog powered by Next.js and themed by Seje.",
    description: "",
    keywords: [],
    author: "",

    permalink: {
        site: "https://example.com",
        post: "/:YYYY/:MM/:DD/:title",
        page: "/:title",
        category: "/:slug",
        tag: "/:slug",
    },

    home: {
        showExcerpt: true,
        showReadMore: true,
        postsPerPage: 10,
    },

    menu: {
        defaultItems: {
            home: "主页",
            archives: "归档",
            categories: "分类",
            tags: "标签",
        },

        customItems: {},
    },

    footer: {
        showCopyright: true,
    },

    code: {
        theme: ["white-plus", "dark-plus"],
    },
};

export const blogConfig: UserConfig = {
    ...defaultBlogConfig,
    ...userBlogConfig,

    permalink: {
        ...defaultBlogConfig.permalink,
        ...userBlogConfig.permalink,
    },

    home: {
        ...defaultBlogConfig.home,
        ...userBlogConfig.home,
    },

    menu: {
        defaultItems: {
            ...defaultBlogConfig.menu.defaultItems,
            ...userBlogConfig.menu?.defaultItems,
        },

        customItems: {
            ...defaultBlogConfig.menu.customItems,
            ...userBlogConfig.menu?.customItems,
        },
    },

    footer: {
        ...defaultBlogConfig.footer,
        ...userBlogConfig.footer,
    },

    code: {
        ...defaultBlogConfig.code,
        ...userBlogConfig.code,
    },
};
