import { blogConfig } from "@/config";
import { db } from "@/prisma";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseTagLink } from "./permalink";
import { diff } from "./utils";

export const createTag = async (slug: string) => {
    const tag = await db.tag.create({
        data: { slug, pathname: "", permalink: "" },
    });

    // 根据更新后的数据，更新链接
    tag.pathname = parseTagLink(tag, blogConfig.permalink.tag);
    tag.permalink = joinPathname("tags", tag.pathname);

    await tag.save();

    logger.info(`Tag created: ${slug}`);
};

export const updateTag = async (slug: string) => {
    const tag = await db.tag.findUnique({ where: { slug } });
    if (!tag) {
        return;
    }

    // 根据更新后的数据，更新链接
    tag.pathname = parseTagLink(tag, blogConfig.permalink.tag);
    tag.permalink = joinPathname("tags", tag.pathname);

    await tag.save();

    logger.info(`Tag updated: ${slug}`);
};

export const removeTag = async (slug: string) => {
    await db.tag.delete({ where: { slug } });

    logger.info(`Tag removed: ${slug}`);
};

export const diffTagSlugs = async (slugs: string[]) => {
    const categories = (await db.tag.findMany()).map(({ slug }) => slug);

    return diff(slugs, categories);
};

export const dispatchTags = async (slugs: string[]) => {
    const diff = await diffTagSlugs(slugs);

    for (const slug of diff.create) {
        await createTag(slug);
    }

    for (const slug of diff.remove) {
        await removeTag(slug);
    }
};
