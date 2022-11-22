import path from "path";

import { getBlogPath } from "share/utils";

const parsePaths = (paths: Config.Paths) =>
    Object.fromEntries(
        Object.entries(paths).map(([key, value]) => [key, path.resolve(getBlogPath(), value)]),
    ) as unknown as Config.Paths;

export const parseConfig = (config: Config.Blog) => {
    config.paths = parsePaths(config.paths);

    return config;
};
