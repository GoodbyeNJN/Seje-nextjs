import { blogConfig } from "@/config";
import { Category } from "@/db";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseCategoryLink } from "./permalink";

export const createCategory = async (slug: string) => {
    let category = await Category.findOneBy({ slug });
    if (category) {
        return category;
    }

    category = new Category({ slug });
    await category.save();

    // 根据更新后的数据，更新链接
    const pathname = parseCategoryLink(category, blogConfig.permalink.category);
    category.assign({ pathname, permalink: joinPathname("categories", pathname) });

    await category.save();
    logger.info(`Category created: ${slug}`);

    return category;
};

export const removeCategory = async (slug: string) => {
    const category = await Category.findOne({
        where: { slug },
        relations: { posts: true },
    });
    if (!category || category.posts.length) {
        return null;
    }

    await category.remove();
    logger.info(`Category removed: ${slug}`);

    return category;
};
