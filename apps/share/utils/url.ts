import { blogConfig } from "share/config";
import { join } from "urlcat";

export const getRelativePath = (...paths: string[]) => {
    const relative = paths.reduce((acc, path) => join(acc, "/", path), "");

    return "/" + relative;
};

export const getAbsolutePath = (...paths: string[]) => {
    const base = join("", "/", blogConfig.url.base);
    const absolute = paths.reduce((acc, path) => join(acc, "/", path), base);

    return "/" + absolute;
};

export const getBasePath = () => {
    const base = join("", "/", blogConfig.url.base);

    return base ? "/" + base : base;
};

export const getSiteUrl = () => join(blogConfig.url.origin, "/", getBasePath());

export const isFullUrl = (str: string) => {
    try {
        const url = new URL(str);
        return Boolean(url.protocol);
    } catch {
        return false;
    }
};
