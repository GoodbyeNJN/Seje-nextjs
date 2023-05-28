import { blogConfig } from "@/config";
import { db } from "@/prisma";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseCategoryLink } from "./permalink";
import { diff } from "./utils";

export const createCategory = async (slug: string) => {
    const category = await db.category.create({
        data: { slug, pathname: "", permalink: "" },
    });

    // 根据更新后的数据，更新链接
    category.pathname = parseCategoryLink(category, blogConfig.permalink.category);
    category.permalink = joinPathname("categories", category.pathname);

    await category.save();

    logger.info(`Category created: ${slug}`);
};

export const updateCategory = async (slug: string) => {
    const category = await db.category.findUnique({ where: { slug } });
    if (!category) {
        return;
    }

    // 根据更新后的数据，更新链接
    category.pathname = parseCategoryLink(category, blogConfig.permalink.category);
    category.permalink = joinPathname("categories", category.pathname);

    await category.save();

    logger.info(`Category updated: ${slug}`);
};

export const removeCategory = async (slug: string) => {
    await db.category.delete({ where: { slug } });

    logger.info(`Category removed: ${slug}`);
};

export const diffCategorySlugs = async (slugs: string[]) => {
    const categories = (await db.category.findMany()).map(({ slug }) => slug);

    return diff(slugs, categories);
};

export const dispatchCategories = async (slugs: string[]) => {
    const diff = await diffCategorySlugs(slugs);

    for (const slug of diff.create) {
        await createCategory(slug);
    }

    for (const slug of diff.remove) {
        await removeCategory(slug);
    }
};
