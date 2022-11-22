import path from "path";

import { getBlogPath } from "./path";

const parsePaths = (paths: Config.Paths) =>
    Object.fromEntries<Config.Paths>(
        Object.entries(paths).map(([key, value]) => [key, path.resolve(getBlogPath(), value)]),
    );

export const parseConfig = (config: Config.Blog): Config.Blog => ({
    ...config,
    paths: parsePaths(config.paths),
});
