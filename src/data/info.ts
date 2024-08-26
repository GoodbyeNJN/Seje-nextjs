import { joinInAbsolute } from "@/utils/url";

import { getPostModules } from "./modules";

import type { PageInfo, PostInfo } from "./types";

export const getPostAndPageInfo = async () =>
    getPostModules().map(({ module }) => {
        const { metadata, Summary, default: Page } = module;
        const { type, title, created, updated, categories, tags, permalink } = metadata;

        const pageInfo: PageInfo = {
            type: "page",
            title,
            created,
            updated,
            permalink,
            Summary,
            Page,
        };

        const postInfo: PostInfo = {
            ...pageInfo,
            type: "post",
            categories: categories.map(slug => ({
                slug,
                permalink: joinInAbsolute("categories", slug),
            })),
            tags: tags.map(slug => ({ slug, permalink: joinInAbsolute("tags", slug) })),
        };

        return type === "post" ? postInfo : pageInfo;
    });

export const getInfoByPermalink = async (permalink: string) => {
    const info = await getPostAndPageInfo();
    return info.find(item => item.permalink === permalink);
};
