import { getLayoutModules } from "./modules";

export const getHeader = async () => {
    const { module } = getLayoutModules().find(({ id }) => /header\.mdx?$/.test(id)) || {};
    return module?._createMdxContent;
};

export const getFooter = async () => {
    const { module } = getLayoutModules().find(({ id }) => /footer\.mdx?$/.test(id)) || {};
    return module?._createMdxContent;
};

export const getNavbar = async () => {
    const { module } = getLayoutModules().find(({ id }) => /navbar\.mdx?$/.test(id)) || {};
    return module?._createMdxContent;
};
