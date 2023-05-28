import { blogConfig } from "@/config";
import { db } from "@/prisma";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseTagLink } from "./permalink";

export const createTag = async (slug: string) => {
    if (await db.tag.findUnique({ where: { slug } })) {
        return;
    }

    const tag = await db.tag.create({
        data: { slug, pathname: "", permalink: "" },
    });

    // 根据更新后的数据，更新链接
    tag.pathname = parseTagLink(tag, blogConfig.permalink.tag);
    tag.permalink = joinPathname("tags", tag.pathname);

    await tag.save();

    logger.info(`Tag created: ${slug}`);
};

export const removeTag = async (slug: string) => {
    const tag = await db.tag.findUnique({
        where: { slug },
        include: { posts: true },
    });
    if (!tag || tag.posts.length) {
        return;
    }

    await tag.delete();

    logger.info(`Tag removed: ${slug}`);
};

// export const createTag = async (slug: string) => {
// const tag = await db.tag.create({
//     data: { slug, pathname: "", permalink: "" },
// });

// // 根据更新后的数据，更新链接
// tag.pathname = parseTagLink(tag, blogConfig.permalink.tag);
// tag.permalink = joinPathname("tags", tag.pathname);

// await tag.save();

// logger.info(`Tag created: ${slug}`);
// };

// export const removeTag = async (slug: string) => {
//     await db.tag.delete({ where: { slug } });

//     logger.info(`Tag removed: ${slug}`);
// };
