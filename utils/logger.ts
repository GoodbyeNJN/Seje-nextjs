import chalk from "chalk";
import _ from "lodash";

const format = (level: "info" | "warn" | "error") => {
    const map = {
        info: `- ${chalk.cyan(level)} `,
        warn: `- ${chalk.yellow(level)} `,
        error: `- ${chalk.red(level)}`,
        default: `- ${chalk.green(level)}`,
    };

    return map[level] || map.default;
};

export const createLogger = (prefix?: string) => ({
    info: prefix
        ? _.partial(console.log, prefix, format("info"))
        : _.partial(console.log, format("info")),
    warn: prefix
        ? _.partial(console.log, prefix, format("warn"))
        : _.partial(console.log, format("warn")),
    error: prefix
        ? _.partial(console.log, prefix, format("error"))
        : _.partial(console.log, format("error")),
});

export const logger = createLogger();
