import path from "node:path";

export interface Resources {
    favicon: string;
    posts: string;
    images: string;
    pages: string;
    themes: string;
}

const getAbsolutePath = (relativePath: string) => path.resolve(process.env.BLOG_PATH, relativePath);

export const resourceDirName: Resources = {
    favicon: "favicon.ico",
    posts: "posts",
    images: "images",
    pages: "pages",
    themes: "themes",
};

export const resourceAbsolutePath: Resources = {
    favicon: getAbsolutePath("favicon.ico"),
    posts: getAbsolutePath("posts"),
    images: getAbsolutePath("images"),
    pages: getAbsolutePath("pages"),
    themes: getAbsolutePath("themes"),
};
