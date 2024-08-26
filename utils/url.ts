import { getBasePath } from "@/config";

export const join = (...paths: string[]) => {
    const separator = "/";

    let pathname = "";
    for (const path of paths) {
        let part = path.startsWith(separator) ? path.slice(separator.length) : path;
        part = part.endsWith(separator) ? part.slice(0, -separator.length) : part;

        if (part) {
            pathname += pathname ? separator + part : part;
        }
    }

    return pathname;
};
export const split = (path: string) => {
    const separator = "/";

    const paths = [];

    let part = "";
    for (const char of path) {
        if (char === separator) {
            part && paths.push(part);
            part = "";
        } else {
            part += char;
        }
    }

    part && paths.push(part);

    return paths;
};

export const joinInAbsolute = (...paths: string[]) => "/" + join(...paths);

export const joinWithBase = (...paths: string[]) => join(...split(getBasePath()), ...paths);

export const joinWithBaseInAbsolute = (...paths: string[]) =>
    joinInAbsolute(joinWithBase(...paths));

export const splitWithoutBase = (path: string) => {
    const paths = split(path);
    const basePaths = split(getBasePath());
    return paths[0] === basePaths[0] ? paths.slice(basePaths.length) : paths;
};

export const isFullUrl = (str: string) => {
    try {
        const url = new URL(str);
        return R.isTruthy(url.protocol);
    } catch {
        return false;
    }
};
