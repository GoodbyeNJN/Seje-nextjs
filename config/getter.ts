import { isObject, isString } from "@/utils/type";

import { blogConfig, defaultMenuItems } from "./config";

import type { UserConfig } from "./schema";

const GOOGLEAPIS_MAP = {
    google: "fonts.googleapis.com",
    loli: "fonts.loli.net",
    geekzu: "fonts.geekzu.org",
};

const GSTATIC_MAP = {
    google: "fonts.gstatic.com",
    loli: "gstatic.loli.net",
    geekzu: "gapis.geekzu.org/g-fonts",
};

export const getMenuItems = () => {
    const { defaultItems, customItems } = blogConfig.menu;

    const items = [
        ...Object.entries(defaultItems)
            .map(([key, value]) => ({
                label: value || "",
                link: key,
            }))
            .filter(({ label }) => Boolean(label)),
        ...Object.entries(customItems).map(([key, value]) => ({
            label: key,
            link: value,
        })),
    ];

    return items;
};

export const getPageTitles = () => {
    const { defaultItems } = blogConfig.menu;

    return Object.fromEntries<Record<keyof UserConfig["menu"]["defaultItems"], string>>(
        Object.entries(defaultItems).map(([key, value]) => [key, value || defaultMenuItems[key]]),
    );
};

export const getBasePath = () => {
    const { pathname } = new URL(blogConfig.url);

    return pathname === "/" ? "" : pathname;
};

export const getFontMirror = () => {
    const { mirror } = blogConfig.font;

    if (isObject(mirror)) {
        return mirror;
    }

    const googleapis = GOOGLEAPIS_MAP[mirror];
    const gstatic = GSTATIC_MAP[mirror];

    return { googleapis, gstatic };
};

export const getCodeTheme = () => {
    const { theme } = blogConfig.code;

    if (isString(theme)) {
        return { dark: theme, light: theme };
    } else {
        return theme;
    }
};
