import { blogConfig } from "@/config";
import { join } from "@/utils/url";

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
