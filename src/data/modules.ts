import type { Module } from "./types";

export const getAllModules = () => {
    const context = require.context("../app/(markdowns)", true, /\.mdx?$/);
    const ids = context.keys().filter(id => id.startsWith("./"));

    for (const id of ids) {
        delete require.cache[context.resolve(id)];
    }

    return ids.map(id => ({ id, module: context<Module>(id) }));
};

export const getPostModules = () => getAllModules().filter(({ id }) => /\/page\.mdx?$/.test(id));

export const getLayoutModules = () => getAllModules().filter(({ id }) => !/\/page\.mdx?$/.test(id));
