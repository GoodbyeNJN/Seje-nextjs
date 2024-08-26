import userBlogConfig from "@/blog/config";

import type { UserConfig } from "./schema";

export const googleapisMap = {
    google: "fonts.googleapis.com",
    loli: "fonts.loli.net",
    geekzu: "fonts.geekzu.org",
};

export const gstaticMap = {
    google: "fonts.gstatic.com",
    loli: "gstatic.loli.net",
    geekzu: "gapis.geekzu.org/g-fonts",
};

export const defaultNavbar = [
    { label: "主页", href: "/" },
    { label: "归档", href: "/archives" },
    { label: "分类", href: "/categories" },
    { label: "标签", href: "/tags" },
];

export const defaultBlogConfig: UserConfig = {
    title: "Yet Another Blog",
    description: "Yet another blog powered by Next.js and themed by Seje.",
    keywords: [],
    author: "",
    url: "https://example.com",

    home: {
        showSummary: true,
        showReadMore: true,
        showPagination: true,
        postsPerPage: 5,
    },

    post: {
        prependPostSummary: false,
        prependPageSummary: false,
        showPostCategories: true,
        showPostTags: true,
        showPageTitle: false,
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

    date: {
        showDateInPost: true,
        showDateInPage: false,
        showCreatedOrUpdated: "created",
        showDetailTooltip: true,
    },

    font: {
        mirror: "google",
    },

    code: {
        theme: { dark: "dark-plus", light: "light-plus" },
        showLanguage: true,
        showLineNumber: true,
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

    post: {
        ...defaultBlogConfig.post,
        ...userBlogConfig.post,
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

    date: {
        ...defaultBlogConfig.date,
        ...userBlogConfig.date,
    },

    font: {
        ...defaultBlogConfig.font,
        ...userBlogConfig.font,
    },

    code: {
        ...defaultBlogConfig.code,
        ...userBlogConfig.code,
    },

    trace: {
        ...defaultBlogConfig.trace,
        ...userBlogConfig.trace,
    },
};
