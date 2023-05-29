import type { Dayjs } from "dayjs";

export interface CategoryOrTag {
    slug: string;
    permalink: string;
}

export interface RawFrontmatter {
    type: "post" | "page";
    draft: boolean;
    title: string;
    created: Dayjs;
    updated: Dayjs;
    description: string;
    permalink: string;
}

export interface PostFrontmatter extends RawFrontmatter {
    type: "post";
    categories: CategoryOrTag[];
    tags: CategoryOrTag[];
}

export interface PageFrontmatter extends RawFrontmatter {
    type: "page";
}

export interface RawMarkdown {
    excerpt: string;
    content: string;
}

export interface PostMarkdown extends RawMarkdown, PostFrontmatter {}

export interface PageMarkdown extends RawMarkdown, PageFrontmatter {}
