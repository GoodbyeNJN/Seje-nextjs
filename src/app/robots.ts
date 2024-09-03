import { blogConfig } from "virtual-blog-config";

import { join } from "utils/string";

import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: join(blogConfig.url, "sitemap.xml"),
    };
};

export default robots;
