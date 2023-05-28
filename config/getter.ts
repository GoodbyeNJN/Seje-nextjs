import { blogConfig } from "./config";

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
            label: value,
            link: key,
        })),
    ];

    return items;
};
