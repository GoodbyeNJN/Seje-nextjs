import userBlogConfig from "@/blog/config";

import type { UserConfig } from "./schema";

export const defaultMenuItems: Record<keyof UserConfig["menu"]["defaultItems"], string> = {
    home: "主页",
    archives: "归档",
    categories: "分类",
    tags: "标签",
};

export const defaultBlogConfig: UserConfig = {
    title: "Yet Another Blog",
    description: "Yet another blog powered by Next.js and themed by Seje.",
    keywords: [],
    author: "",
    url: "https://example.com",

    home: {
        showExcerpt: true,
        showReadMore: true,
        postsPerPage: 10,
    },

    menu: {
        defaultItems: defaultMenuItems,
        customItems: {},
    },

    footer: {
        showCopyright: true,
    },

    font: {
        mirror: "google",
    },

    code: {
        theme: { dark: "dark-plus", light: "light-plus" },
        showLanguage: true,
    },

    trace: {},
};

export const blogConfig: UserConfig = {
    ...defaultBlogConfig,
    ...userBlogConfig,

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

    font: {
        ...defaultBlogConfig.font,
        ...userBlogConfig.font,
    },

    code: {
        ...defaultBlogConfig.code,
        ...userBlogConfig.code,
    },

    trace: {},
};
