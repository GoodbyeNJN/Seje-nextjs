import path from "node:path";

import fs from "fs-extra";

import { getCodeTheme } from "@/config";
import { blogThemePath } from "@/config/path";

import type { Options } from "rehype-pretty-code";

export const getRehypePrettyCodeOptions = (): Partial<Options> => {
    const isCustomThemeExists = (theme: string) =>
        fs.existsSync(path.resolve(blogThemePath, `${theme}.json`));
    const getCustomTheme = (theme: string) =>
        fs.readJsonSync(path.resolve(blogThemePath, `${theme}.json`));

    const { dark, light } = getCodeTheme();
    const isSingleTheme = dark === light;

    let theme: Options["theme"];
    if (isSingleTheme) {
        theme = isCustomThemeExists(dark) ? getCustomTheme(dark) : dark;
    } else {
        theme = {
            dark: isCustomThemeExists(dark) ? getCustomTheme(dark) : dark,
            light: isCustomThemeExists(light) ? getCustomTheme(light) : light,
        };
    }

    return { theme, keepBackground: true, defaultLang: "txt" };
};
