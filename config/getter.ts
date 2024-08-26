import { blogConfig } from "./config";

export const getMenuItems = () => {
    const { defaultItems, customItems } = blogConfig.menu;

    const items = [
        ...Object.entries(defaultItems)
            .map(([k, v]) => ({
                label: v || "",
                link: k,
            }))
            .filter(({ label }) => R.isTruthy(label)),
        ...Object.entries(customItems).map(([k, v]) => ({
            label: k,
            link: v,
        })),
    ];

    return items;
};

export const getPageTitles = () => {
    const { defaultItems } = blogConfig.menu;
    const defaultMenuItems = { home: "主页", archives: "归档", categories: "分类", tags: "标签" };

    return R.mapValues(defaultItems, (v, k) => v || defaultMenuItems[k]);
};

export const _getBasePath = () => {
    const { pathname } = new URL(blogConfig.url);

    return pathname === "/" ? "" : pathname;
};

export const getBasePath = () => {
    const { pathname } = new URL(blogConfig.url);

    return pathname;
};
