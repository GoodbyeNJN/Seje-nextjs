import path from "node:path";
import url from "node:url";

import glob from "fast-glob";

export const getProjectPath = () => {
    const filepath = url.fileURLToPath(import.meta.url);
    const { base, dir } = path.parse(filepath);

    if (base === "path.ts") {
        return path.resolve(dir, "..");
    } else if (base === "next.config.mjs") {
        return dir;
    } else {
        console.warn("获取项目路径出现异常，将使用默认项目路径，请检查是否正确");
        console.warn("默认项目路径为:", dir);
        return dir;
    }
};

export const getNextPath = () => path.resolve(getProjectPath(), "src");
export const getNextMarkdownPath = () => path.resolve(getNextPath(), "app/(markdowns)");
export const getNextAssetPath = () => path.resolve(getNextPath(), "assets");

export const getPublicPath = () => path.resolve(getProjectPath(), "public");
export const getPublicAssetPath = () => path.resolve(getPublicPath(), "assets");
export const getPublicImagePath = () => path.resolve(getPublicPath(), "images");

export const getBlogPath = () => path.resolve(getProjectPath(), "blog");
export const getBlogConfigPath = () => path.resolve(getBlogPath(), "config.js");

export const getBlogPostPath = () => path.resolve(getBlogPath(), "posts");
export const getBlogLayoutPath = () => path.resolve(getBlogPath(), "layouts");
export const getBlogAssetPath = () => path.resolve(getBlogPath(), "assets");
export const getBlogImagePath = () => path.resolve(getBlogPath(), "images");
export const getBlogThemePath = () => path.resolve(getBlogPath(), "themes");

export const getGlob = (filepath: string) => glob.convertPathToPattern(filepath);
