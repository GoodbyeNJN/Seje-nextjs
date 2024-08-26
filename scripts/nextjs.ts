import { $, log } from "zx";

import type { CommonOptions } from "./types";
import type { ProcessPromise } from "zx";

export interface Options extends CommonOptions {
    command: string;
    argv: string[];
    analyze: boolean;
}

// 恢复 zx 控制台彩色输出
// https://google.github.io/zx/known-issues#colors-in-subprocess
process.env.FORCE_COLOR = "3";
$.log = entry => {
    switch (entry.kind) {
        case "cmd":
            break;
        default:
            log(entry);
    }
};

let p: ProcessPromise | undefined;

export const startNextJs = (options: Options) => {
    const { command, argv, analyze } = options;
    if (analyze) {
        $.env.ANALYZE = "1";
    } else {
        delete $.env.ANALYZE;
    }

    p = $`npx next ${command} ${argv.join(" ")}`;
};

export const stopNextJs = async () => {
    await p?.kill("SIGTERM");
};
