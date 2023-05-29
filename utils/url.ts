import { getBasePath } from "@/config";

import { isBoolean, isNumber, isString } from "./type";

export type ParamMap = Record<string, string | number | boolean>;

const basePath = getBasePath();

const _generatePath = (template: string, params: ParamMap) => {
    const remainingParams = { ...params };

    const renderedPath = template.replace(/:[_A-Za-z]+[_A-Za-z0-9]*/g, p => {
        const key = p.slice(1);
        const value = params[key];

        if (!Object.hasOwn(params, key)) {
            throw new Error(`Missing value for path parameter ${key}.`);
        }
        if (!isString(value) && !isNumber(value) && !isBoolean(value)) {
            throw new TypeError(
                `Path parameter ${key} cannot be of type ${typeof value}. ` +
                    `Allowed types are: string, number, boolean.`,
            );
        }
        if (isString(value) && value.trim() === "") {
            throw new Error(`Path parameter ${key} cannot be an empty string.`);
        }

        delete remainingParams[key];
        return encodeURIComponent(value);
    });

    return renderedPath;
};

export const joinParts = (parts: string[], separator: string) =>
    parts.reduce((prev, curr) => {
        const p1 = prev.endsWith(separator) ? prev.slice(0, -separator.length) : prev;
        const p2 = curr.startsWith(separator) ? curr.slice(separator.length) : curr;
        return p1 === "" || p2 === "" ? p1 + p2 : p1 + separator + p2;
    }, "");

export const splitPath = (path: string, separator: string) => {
    const pathname = path.startsWith(separator)
        ? path.slice(separator.length)
        : path.endsWith(separator)
        ? path.slice(0, -separator.length)
        : path;
    return pathname.split(separator);
};

export const joinPathnameWithoutPrefix = (...paths: string[]) => joinParts(paths, "/");

export const joinPathname = (...paths: string[]) => "/" + joinPathnameWithoutPrefix(...paths);

export const splitPathname = (pathname: string) => splitPath(pathname, "/");

export const joinPathnameWithBasePath = (...paths: string[]) => joinPathname(basePath, ...paths);

export const isFullUrl = (str: string) => {
    try {
        const url = new URL(str);
        return Boolean(url.protocol);
    } catch {
        return false;
    }
};
