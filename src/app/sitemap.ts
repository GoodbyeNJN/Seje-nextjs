import { getAllCategories, getAllPages, getAllPosts, getAllTags } from "data";
import dayjs from "dayjs";

import { blogConfig } from "@/config";
import { join } from "@/utils/url";

import type { MetadataRoute } from "next";

type SitemapItem = MetadataRoute.Sitemap[number];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const allPosts = (await getAllPosts()).map(({ updated, ...rest }) => ({
        updated: dayjs(updated || undefined),
        ...rest,
    }));
    const allPages = (await getAllPages()).map(({ updated, ...rest }) => ({
        updated: dayjs(updated || undefined),
        ...rest,
    }));
    const lastModified = new Date(
        Math.max(
            ...allPosts.map(({ updated }) => updated.valueOf()),
            ...allPages.map(({ updated }) => updated.valueOf()),
        ),
    );

    const categories = await getAllCategories().then(categories =>
        categories.map<SitemapItem>(({ permalink }) => ({
            url: join(blogConfig.url, permalink),
            lastModified,
        })),
    );

    const tags = await getAllTags().then(categories =>
        categories.map<SitemapItem>(({ permalink }) => ({
            url: join(blogConfig.url, permalink),
            lastModified,
        })),
    );

    const posts = allPosts.map<SitemapItem>(({ permalink, updated }) => ({
        url: join(blogConfig.url, permalink),
        lastModified: updated.toDate(),
    }));

    const pages = allPages.map<SitemapItem>(({ permalink, updated }) => ({
        url: join(blogConfig.url, permalink),
        lastModified: updated.toDate(),
    }));

    return [
        { url: blogConfig.url, lastModified },
        { url: join(blogConfig.url, "archives"), lastModified },
        { url: join(blogConfig.url, "categories"), lastModified },
        { url: join(blogConfig.url, "tags"), lastModified },
        ...posts,
        ...pages,
        ...categories,
        ...tags,
    ];
};

export default sitemap;
