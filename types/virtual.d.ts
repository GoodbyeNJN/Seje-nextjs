declare module "virtual-blog-config" {
    import type { BlogConfig as BlogConfigType } from "server/blog/schema";

    export type BlogConfig = BlogConfigType;

    export const defaultNavbar: { label: string; href: string }[];
    export const defaultGoogleApis: {
        google: string;
        loli: string;
        geekzu: string;
    };
    export const defaultGStatic: {
        google: string;
        loli: string;
        geekzu: string;
    };
    export const defaultBlogConfig: BlogConfig;
    export const blogConfig: BlogConfig;
}
