import chalk from "chalk";
import { generateErrorMessage } from "zod-error";

import userBlogConfig from "@/blog/config";

import { partialUserConfigSchema } from "./schema";

import type { ErrorMessageOptions } from "zod-error";

const options: ErrorMessageOptions = {
    code: {
        enabled: true,
        label: null,
    },
    path: {
        enabled: true,
        type: "objectNotation",
        label: null,
    },
    message: {
        enabled: true,
        label: null,
    },
    delimiter: {
        component: " - ",
        error: "\n",
    },
    transform: ({ codeComponent, pathComponent, messageComponent }) =>
        `[ ${chalk.red(codeComponent.toUpperCase())} ]: ${pathComponent} - ${messageComponent}.`,
};

const res = partialUserConfigSchema.safeParse(userBlogConfig);

if (!res.success) {
    const message = generateErrorMessage(res.error.issues, options);
    throw new Error(message);
}
