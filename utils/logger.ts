import chalk from "chalk";

const format = (level: "info" | "warn" | "error") => {
    const map = {
        info: `${chalk.cyan(level)} `,
        warn: `${chalk.yellow(level)} `,
        error: `${chalk.red(level)}`,
        default: `${chalk.green(level)}`,
    };

    return map[level] || map.default;
};

const logger =
    (...args1: Parameters<typeof console.log>) =>
    (...args2: Parameters<typeof console.log>) =>
        console.log(...args1, ...args2);

const info = format("info");
const warn = format("warn");
const error = format("error");

export const createLogger = (prefix?: string) =>
    prefix
        ? { info: logger(prefix, info), warn: logger(prefix, warn), error: logger(prefix, error) }
        : { info: logger(info), warn: logger(warn), error: logger(error) };
