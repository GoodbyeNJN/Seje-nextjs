import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

import { isDevEnv } from "@/utils/env";

import { save } from "./extend";

export const init = () => {
    const prisma = new PrismaClient({
        log: isDevEnv ? [/* "query", */ "error", "warn"] : ["error"],
    });

    // @ts-expect-error
    prisma.$on("query", event => {
        const { query, params } = event as unknown as { query: string; params: string };

        const paramsArray = JSON.parse(params);

        let i = 0;
        const queryWithParams = query.replace(/\?/g, JSON.stringify(paramsArray[i++]!));

        console.log(chalk.green("prisma:query"), queryWithParams);
    });

    return prisma.$extends(save);
};
