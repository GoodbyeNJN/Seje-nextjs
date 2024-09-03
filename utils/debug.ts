import debug from "debug";
import { isString } from "remeda";

import type { Debugger as OriginDebugger } from "debug";

type CallableDebugger = (...args: Parameters<OriginDebugger>) => ReturnType<OriginDebugger>;

export interface Debugger extends OriginDebugger {
    start: CallableDebugger;
    end: CallableDebugger;
}

const transform = (
    prefix: string,
    args: Parameters<CallableDebugger>,
): Parameters<CallableDebugger> => {
    const [message, ...rest] = args;
    const formatter = `${prefix} ${isString(message) ? message : "%O"}`;

    return [formatter, ...rest];
};

export const createDebugger = (prefix: string) => {
    const instance = debug(`app:${prefix}`) as Debugger;

    instance.start = (...args) => instance(...transform("🟢", args));
    instance.end = (...args) => instance(...transform("🔴", args));

    return instance;
};
