import fs from "node:fs";
import path from "node:path";

import { blogConfig } from "@/config";
import { createLogger } from "@/utils/logger";
import { getBlogThemePath } from "@/utils/path";

import { getLoadedTheme, getLoadedThemeNames, loadTheme } from "./highlighter";

import type { CodeOptionsThemes, CodeToHastOptions, ThemeRegistrationResolved } from "shikiji";

type ThemeType = "dark" | "light";
export type ThemeVar =
    | "" // empty string for fg
    | "bg"
    | "bar-bg"
    | "title-fg"
    | "title-bg"
    | "index-fg"
    | "insert-bg"
    | "remove-bg"
    | "highlight-fg"
    | "highlight-bg";

const logger = createLogger("[rehype-code]");

const cache = new Map<string, ThemeRegistrationResolved>();

// dark-plus
const defaultDarkColors = {
    "tab.border": "#252526",
    "tab.activeBackground": "#1e1e1e",
    "tab.activeForeground": "#ffffff",
    "tab.inactiveBackground": "#2d2d2d",
    "tab.inactiveForeground": "#ffffff80",
    "editorLineNumber.foreground": "#858585",
    "diffEditor.insertedLineBackground": "#9bb95533",
    "diffEditor.removedLineBackground": "#ff000033",
    "editor.selectionBackground": "#264f78",
    "editor.inactiveSelectionBackground": "#3a3d41",
};

// light-plus
const defaultLightColors = {
    "tab.border": "#f3f3f3",
    "tab.activeBackground": "#ffffff",
    "tab.activeForeground": "#333333",
    "tab.inactiveBackground": "#ececec",
    "tab.inactiveForeground": "#333333b3",
    "editorLineNumber.foreground": "#237893",
    "diffEditor.insertedLineBackground": "#9bb95533",
    "diffEditor.removedLineBackground": "#ff000033",
    "editor.selectionBackground": "#add6ff",
    "editor.inactiveSelectionBackground": "#e5ebf1",
};

const resolveCustomTheme = async (theme: string, type: ThemeType) => {
    const filepath = path.resolve(getBlogThemePath(), `${theme}.json`);
    const isFileExists = fs.existsSync(filepath);
    if (!isFileExists) {
        logger.error(`主题文件不存在: ${filepath}`);
        return null;
    }

    try {
        const content = await fs.promises.readFile(filepath, "utf-8");
        const customTheme: ThemeRegistrationResolved = JSON.parse(content);
        if (!customTheme.type) {
            customTheme.type = type || "dark";
        }

        await loadTheme(customTheme);

        return getLoadedTheme(customTheme.name);
    } catch (error) {
        logger.error(`无法加载主题文件: ${filepath}`);
        logger.error(error);
        return null;
    }
};

const resolveTheme = async (theme: string, type: ThemeType = "dark") => {
    if (cache.has(theme)) {
        return cache.get(theme);
    }

    const isBuiltinTheme = getLoadedThemeNames().includes(theme);
    if (isBuiltinTheme) {
        const builtinTheme = getLoadedTheme(theme);
        cache.set(theme, builtinTheme);
        return builtinTheme;
    }

    const customTheme = await resolveCustomTheme(theme, type);
    if (customTheme) {
        cache.set(theme, customTheme);
        return customTheme;
    }

    const fallbackTheme = getLoadedTheme(type === "dark" ? "dark-plus" : "light-plus");
    cache.set(theme, fallbackTheme);
    return fallbackTheme;
};

export const getTheme = async () => {
    const { theme } = blogConfig.code;

    if (R.isString(theme)) {
        const darkTheme = await resolveTheme(theme);
        return { isSingleTheme: true, dark: darkTheme, light: darkTheme };
    }

    const { dark, light } = theme;
    const [darkTheme, lightTheme] = await Promise.all([
        resolveTheme(dark, "dark"),
        resolveTheme(light, "light"),
    ]);

    return { isSingleTheme: false, dark: darkTheme, light: lightTheme };
};

export const getThemeVarEntries = (theme: ThemeRegistrationResolved, vars: ThemeVar[]) => {
    const { type, fg, bg, colors } = theme;
    const defaultColors = type === "light" ? defaultLightColors : defaultDarkColors;

    const themeColors: Record<ThemeVar, string> = {
        "": fg,
        bg,
        "title-fg": colors?.["tab.activeForeground"] || defaultColors["tab.activeForeground"],
        "title-bg": colors?.["tab.activeBackground"] || defaultColors["tab.activeBackground"],
        "bar-bg": colors?.["tab.border"] || defaultColors["tab.border"],
        "index-fg":
            colors?.["editorLineNumber.foreground"] || defaultColors["editorLineNumber.foreground"],
        "insert-bg":
            colors?.["diffEditor.insertedLineBackground"] ||
            defaultColors["diffEditor.insertedLineBackground"],
        "remove-bg":
            colors?.["diffEditor.removedLineBackground"] ||
            defaultColors["diffEditor.removedLineBackground"],
        "highlight-fg":
            colors?.["editor.selectionBackground"] || defaultColors["editor.selectionBackground"],
        "highlight-bg":
            colors?.["editor.selectionBackground"] || defaultColors["editor.selectionBackground"],
    };

    return R.pipe(themeColors, R.pick(vars), R.entries);
};

export const findTokenFg = (theme: ThemeRegistrationResolved, token: string) => {
    const tokenColor = theme.settings.find(({ scope }) => scope?.includes(token));

    return tokenColor?.settings.foreground;
};

export const getCodeToHastOptions = async (
    options: Omit<CodeToHastOptions, "theme" | "themes">,
) => {
    const { isSingleTheme, dark, light } = await getTheme();
    const themeOptions: CodeOptionsThemes = isSingleTheme
        ? { theme: dark.name }
        : {
              themes: { dark: dark.name, light: light.name },
              defaultColor: false,
              //   cssVariablePrefix: "--",
          };
    const codeToHastOptions: CodeToHastOptions = { ...themeOptions, ...options };

    return codeToHastOptions;
};
