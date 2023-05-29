import path from "node:path";

export const blogPath = path.resolve(process.env.APP_PATH, "blog");
export const publicPath = path.resolve(process.env.APP_PATH, "public");

export const projectAssetsPath = path.resolve(process.env.APP_PATH, "assets");

export const blogFaviconPath = path.resolve(blogPath, "favicon.ico");
export const blogMarkdownPath = path.resolve(blogPath, "markdowns");
export const blogImagePath = path.resolve(blogPath, "images");
export const blogThemePath = path.resolve(blogPath, "themes");

export const publicFaviconPath = path.resolve(publicPath, "favicon.ico");
export const publicImagePath = path.resolve(publicPath, "images");
export const publicAssetsPath = path.resolve(publicPath, "assets");
