import { blogConfig } from "share/config";

export const getTitle = (prefix: string, separator = " - ") => {
    const { title } = blogConfig;

    return `${prefix}${separator}${title}`;
};
