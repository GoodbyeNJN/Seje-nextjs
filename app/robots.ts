import { blogConfig } from "@/config";
import { joinPathnameWithoutPrefix } from "@/utils/url";

import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: joinPathnameWithoutPrefix(blogConfig.url, "sitemap.xml"),
    };
};

export default robots;
