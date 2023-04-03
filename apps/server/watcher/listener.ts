import path from "path";

import { transformFile } from "@swc/core";
import dayjs from "dayjs";
import fse, { type Stats } from "fs-extra";
import { parser } from "server/parser";

type EventName = "add" | "addDir" | "change" | "unlink" | "unlinkDir";

const getFileMTime = async (path: string) => {
    try {
        const stat = await fse.stat(path);
        return stat.mtime;
    } catch {
        return new Date();
    }
};

const transform = async (source: string) => {
    const { base } = path.parse(source);

    const { code } = await transformFile(source, {
        filename: base,
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: false,
            },
            target: "es2022",
            loose: false,
            minify: {
                compress: { defaults: true },
                mangle: true,
            },
        },
        module: {
            type: "es6",
        },
        minify: true,
    });

    return code;
};

export const getCommonFileListener =
    (source: string, target: string) => async (event: EventName, src: string) => {
        const dest = path.resolve(target, path.relative(source, src));

        switch (event) {
            case "addDir": {
                fse.emptyDir(dest);
                break;
            }

            case "add":
            case "change": {
                fse.copy(src, dest);
                break;
            }

            case "unlink":
            case "unlinkDir": {
                fse.remove(dest);
                break;
            }
        }
    };

export const getTsFileListener =
    (source: string, target: string) => async (event: EventName, src: string) => {
        const { base, name } = path.parse(src);
        const dest = path.resolve(target, `${name}.js`);

        switch (event) {
            case "add":
            case "change": {
                const code = await transform(path.resolve(source, base));
                fse.outputFile(dest, code);
                break;
            }

            case "unlink": {
                fse.remove(dest);
                break;
            }
        }
    };

export const getMdFileListener =
    (type: Parser.FileType) => async (event: EventName, path: string, stats?: Stats) => {
        const mtime = dayjs(stats?.mtime || (await getFileMTime(path))).format();

        switch (event) {
            case "add":
                parser({ name: "create", type, path, mtime });
                break;

            case "change":
                parser({ name: "update", type, path, mtime });
                break;

            case "unlink":
                parser({ name: "remove", type, path, mtime });
                break;
        }
    };
