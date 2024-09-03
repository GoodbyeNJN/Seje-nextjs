import { consola } from "consola";
import { filter, isDefined } from "remeda";

type Args = [message: any, ...args: any[]];

const concat = (...args: Args) => filter(args, isDefined) as [any, ...any[]];

export const createLogger = (prefix?: string) => ({
    info: (...args: Args) => consola.info(...concat(prefix, ...args)),
    warn: (...args: Args) => consola.warn(...concat(prefix, ...args)),
    error: (...args: Args) => consola.error(...concat(prefix, ...args)),
});
