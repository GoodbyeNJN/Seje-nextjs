import path from "path";

import chokidar, { type FSWatcher } from "chokidar";
import _ from "lodash";
import { getBlogConfigPaths } from "share/config";
import { getBlogPath } from "share/utils";

import { getMdFileListener } from "./listener";

// const parse = _.debounce(parser, 250);

// export const buildMarkdown = async () => {
//     const source = getBlogConfigPaths();

//     return chokidar
//         .watch([
//             path.resolve(source.posts, "**/*.md"),
//             path.resolve(source.pages, "**/*.md"),
//             path.resolve(getBlogPath(), "config.js"),
//         ])
//         .on("all", () => parse(isWatchMode));
// };

export const parseMarkdownFiles = async () => {
    const watchers: FSWatcher[] = [];

    const paths = getBlogConfigPaths();

    watchers.push(
        chokidar.watch(path.resolve(paths.posts, "**/*.md")).on("all", getMdFileListener("post")),
    );

    watchers.push(
        chokidar.watch(path.resolve(paths.pages, "**/*.md")).on("all", getMdFileListener("page")),
    );

    return watchers;
};
