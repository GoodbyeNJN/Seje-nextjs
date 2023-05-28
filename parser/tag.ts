import { blogConfig } from "@/config";
import { Tag } from "@/db";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseTagLink } from "./permalink";

export const createTag = async (slug: string) => {
    let tag = await Tag.findOneBy({ slug });
    if (tag) {
        return tag;
    }

    tag = new Tag({ slug });
    await tag.save();

    // 根据更新后的数据，更新链接
    tag.pathname = parseTagLink(tag, blogConfig.permalink.tag);
    tag.permalink = joinPathname("tags", tag.pathname);

    await tag.save();
    logger.info(`Tag created: ${slug}`);

    return tag;
};

export const removeTag = async (slug: string) => {
    const tag = await Tag.findOne({
        where: { slug },
        relations: { posts: true },
    });
    if (!tag || tag.posts.length) {
        return null;
    }

    await tag.remove();
    logger.info(`Tag removed: ${slug}`);

    return tag;
};
