import path from "path";

import chokidar from "chokidar";
import _ from "lodash";
import { parser } from "server/parser";
import { getBlogPaths } from "share/config";
import { getBlogPath } from "share/utils";

const parse = _.debounce(parser, 250);

export const buildMarkdown = async (isWatchMode?: boolean) => {
    const source = getBlogPaths();

    return chokidar
        .watch([
            path.resolve(source.posts, "**/*.md"),
            path.resolve(source.pages, "**/*.md"),
            path.resolve(getBlogPath(), "config.js"),
        ])
        .on("all", () => parse(isWatchMode));
};
