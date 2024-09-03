import { isEmpty } from "remeda";

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

export const addLeadingSlash = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export const removeLeadingSlash = (path: string) => (path.startsWith("/") ? path.slice(1) : path);

export const addTrailingSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);

export const removeTrailingSlash = (path: string) => (path.endsWith("/") ? path.slice(1) : path);

export const removeLeadingUnderscore = (str: string) => str.replace(/^_/, "");

export const removeLeadingDot = (str: string) => str.replace(/^\./, "");

export const removeTrailingPageType = (str: string) => str.replace(/\.(?:post|page)$/, "");

export const toForwardSlash = (path: string) => path.replace(/\\/g, "/");

export const permalinkToSlug = (permalink: string, encode = false) =>
    split(removeLeadingSlash(permalink)).map(encode ? encodeURIComponent : x => x);

export const slugToPermalink = (slug: string[], decode = false) =>
    addLeadingSlash(join(...slug.map(decode ? decodeURIComponent : x => x)));

export const isFullUrl = (str: string) => {
    try {
        const url = new URL(str);

        return !isEmpty(url.protocol) && !isEmpty(url.hostname);
    } catch {
        return false;
    }
};

export const parseKeyValuePairs = (input: string) => {
    const parseKey = (input: string, raw = input): { value: string; end: number } => {
        if (input.length === 0) {
            return { value: "", end: 0 };
        } else if (/^\s/.test(input)) {
            const { value, end } = parseKey(input.slice(1), raw);
            return { value, end: end + 1 };
        }

        let value = "";
        let end = 0;
        if (input[0] === "'" || input[0] === '"') {
            const slice = input.slice(1);

            const index = slice.indexOf(input[0]);
            if (index === -1 || !slice.slice(index + 1).startsWith("=")) {
                throw new Error(`Failed to parse key from input: ${raw}`);
            }

            value = slice.slice(0, index);
            end = 1 + index + 2;
        } else {
            for (const char of input) {
                if (char === "=") break;

                end += 1;
            }

            value = input.slice(0, end);
            end += 1;
        }

        return { value, end };
    };

    const parseValue = (input: string, raw = input): { value: string; end: number } => {
        if (input.length === 0) {
            return { value: "", end: 0 };
        }

        let value = "";
        let end = 0;
        if (input[0] === "'" || input[0] === '"') {
            const slice = input.slice(1);

            const index = slice.indexOf(input[0]);
            if (
                index === -1 ||
                (slice.slice(index + 1).length !== 0 && !/^\s/.test(slice.slice(index + 1)))
            ) {
                throw new Error(`Failed to parse value from input: ${raw}`);
            }

            value = slice.slice(0, index);
            end = 1 + index + 1;
        } else {
            for (const char of input) {
                if (/\s/.test(char)) break;

                end += 1;
            }

            value = input.slice(0, end);
            end += 1;
        }

        return { value, end };
    };

    const pairs: Record<string, string> = {};

    let offset = 0;

    while (offset < input.length) {
        const key = parseKey(input.slice(offset), input);
        offset += key.end;

        const value = parseValue(input.slice(offset), input);
        offset += value.end;

        pairs[key.value] = value.value;

        if (/^\s*$/.test(input.slice(offset))) break;
    }

    return pairs;
};
