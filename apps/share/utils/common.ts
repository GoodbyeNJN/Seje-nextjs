import crypto from "crypto";

import { blogConfig } from "share/config";

import { isUndefined } from "./type";

export const getHash = (str: string, length = 4) =>
    crypto.createHash("shake256", { outputLength: length }).update(str).digest("hex");

export const getTitle = (prefix: string, separator = " - ") => {
    const { title } = blogConfig;

    return `${prefix}${separator}${title}`;
};

export const isServerEnvironment = () => {
    try {
        return isUndefined(window);
    } catch {
        return true;
    }
};
