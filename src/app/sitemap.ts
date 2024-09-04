import { blogConfig } from "virtual-blog-config";

import { getCategories } from "server/api/categories";
import { getPageMetadata, getPostMetadata } from "server/api/metadata";
import { getTags } from "server/api/tags";
import { fromISODateString } from "utils/date";
import { join } from "utils/string";

import type { MetadataRoute } from "next";

type SitemapItem = MetadataRoute.Sitemap[number];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const { url } = blogConfig;
    const { timezone } = blogConfig.date;

    const allPosts = (await getPostMetadata()).map(({ updated, ...rest }) => ({
        updated: fromISODateString(updated, timezone),
        ...rest,
    }));
    const allPages = (await getPageMetadata()).map(({ updated, ...rest }) => ({
        updated: fromISODateString(updated, timezone),
        ...rest,
    }));
    const lastModified = new Date(
        Math.max(
            ...allPosts.map(({ updated }) => updated.valueOf()),
            ...allPages.map(({ updated }) => updated.valueOf()),
        ),
    );

    const categories = await getCategories().then(categories =>
        categories.map<SitemapItem>(({ permalink }) => ({
            url: join(url, permalink),
            lastModified,
        })),
    );

    const tags = await getTags().then(categories =>
        categories.map<SitemapItem>(({ permalink }) => ({
            url: join(url, permalink),
            lastModified,
        })),
    );

    const posts = allPosts.map<SitemapItem>(({ permalink, updated }) => ({
        url: join(url, permalink),
        lastModified: updated.toDate(),
    }));

    const pages = allPages.map<SitemapItem>(({ permalink, updated }) => ({
        url: join(url, permalink),
        lastModified: updated.toDate(),
    }));

    return [
        { url: url, lastModified },
        { url: join(url, "archives"), lastModified },
        { url: join(url, "categories"), lastModified },
        { url: join(url, "tags"), lastModified },
        ...posts,
        ...pages,
        ...categories,
        ...tags,
    ];
};

export default sitemap;
