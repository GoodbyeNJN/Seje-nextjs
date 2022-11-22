export const defaultBlogConfig: Partial<Config.Blog> = {
    title: "Yet Another Blog",
    subtitle: "Yet another blog powered by Next.js and themed by Seje.",
    description: "",
    keywords: [],
    author: "",

    showExcerpt: false,
    showReadMore: true,
    postsPerPage: 10,

    url: {
        origin: "https://example.com",
        base: "/",
        post: "/:YYYY/:MM/:DD/:title",
        category: "/:slug",
        tag: "/:slug",
    },

    menu: {
        home: "主页",
        archives: "归档",
        categories: "分类",
        tags: "标签",
    },

    footer: {
        copyright: true,
    },

    code: {
        theme: ["white-plus", "dark-plus"],
    },

    paths: {
        favicon: "favicon.ico",
        posts: "posts",
        images: "images",
        pages: "pages",
        themes: "",
    },
};
