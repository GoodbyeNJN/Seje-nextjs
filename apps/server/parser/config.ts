import path from "path";

import _ from "lodash";
import { getBlogPath } from "share/utils";

const parsePaths = (paths: Config.Paths): Config.Paths =>
    _.chain(paths)
        .mapValues(_.unary(_.partial(path.resolve, getBlogPath())))
        .value();

export const parseConfig = (config: Config.Blog) => {
    config.paths = parsePaths(config.paths);

    return config;
};
