import { blogConfig } from "@/config";
import { getCategories, getMarkdowns, getPages, getPosts, getTags } from "@/parser";
import { joinPathnameWithoutPrefix } from "@/utils/url";

import type { MetadataRoute } from "next";

type SitemapItem = MetadataRoute.Sitemap[number];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const lastModified = await getMarkdowns()
        .then(markdowns =>
            markdowns.map(({ updated }) => updated).sort((a, b) => b.unix() - a.unix()),
        )
        .then(dates => dates[0]?.toDate() || new Date());

    const categories = await getCategories().then(categories =>
        categories.map<SitemapItem>(({ permalink }) => ({
            url: joinPathnameWithoutPrefix(blogConfig.url, permalink),
            lastModified,
        })),
    );

    const tags = await getTags().then(categories =>
        categories.map<SitemapItem>(({ permalink }) => ({
            url: joinPathnameWithoutPrefix(blogConfig.url, permalink),
            lastModified,
        })),
    );

    const posts = await getPosts().then(posts =>
        posts.map<SitemapItem>(({ permalink, updated }) => ({
            url: joinPathnameWithoutPrefix(blogConfig.url, permalink),
            lastModified: updated.toDate(),
        })),
    );

    const pages = await getPages().then(pages =>
        pages.map<SitemapItem>(({ permalink, updated }) => ({
            url: joinPathnameWithoutPrefix(blogConfig.url, permalink),
            lastModified: updated.toDate(),
        })),
    );

    return [
        { url: blogConfig.url, lastModified },
        { url: joinPathnameWithoutPrefix(blogConfig.url, "archives"), lastModified },
        { url: joinPathnameWithoutPrefix(blogConfig.url, "categories"), lastModified },
        { url: joinPathnameWithoutPrefix(blogConfig.url, "tags"), lastModified },
        ...posts,
        ...pages,
        ...categories,
        ...tags,
    ];
};

export default sitemap;
