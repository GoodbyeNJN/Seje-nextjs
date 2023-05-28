import { blogConfig } from "@/config";
import { db } from "@/prisma";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseCategoryLink } from "./permalink";

export const createCategory = async (slug: string) => {
    if (await db.category.findUnique({ where: { slug } })) {
        return;
    }

    const category = await db.category.create({
        data: { slug, pathname: "", permalink: "" },
    });

    // 根据更新后的数据，更新链接
    category.pathname = parseCategoryLink(category, blogConfig.permalink.category);
    category.permalink = joinPathname("categories", category.pathname);

    await category.save();

    logger.info(`Category created: ${slug}`);
};

export const removeCategory = async (slug: string) => {
    const category = await db.category.findUnique({
        where: { slug },
        include: { posts: true },
    });
    if (!category || category.posts.length) {
        return;
    }

    await category.delete();

    logger.info(`Category removed: ${slug}`);
};

// export const createCategory = async (slug: string) => {
//     const category = await db.category.create({
//         data: { slug, pathname: "", permalink: "" },
//     });

//     // 根据更新后的数据，更新链接
//     category.pathname = parseCategoryLink(category, blogConfig.permalink.category);
//     category.permalink = joinPathname("categories", category.pathname);

//     await category.save();

//     logger.info(`Category created: ${slug}`);
// };

// export const removeCategory = async (slug: string) => {
//     await db.category.delete({ where: { slug } });

//     logger.info(`Category removed: ${slug}`);
// };
