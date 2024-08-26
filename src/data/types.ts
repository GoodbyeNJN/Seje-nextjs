import type { MDXComponents } from "mdx/types";

export interface MdxContentProps {
    components?: MDXComponents;
}

export interface Metadata {
    type: "post" | "page";
    title: string;
    created: string;
    updated: string;
    categories: string[];
    tags: string[];
    permalink: string;
    description: string;
    keywords: string[];
}

export interface Category {
    slug: string;
    permalink: string;
}

export type Tag = Category;

export interface Module {
    metadata: Metadata;
    Summary: React.FC;
    _createMdxContent: React.FC<MdxContentProps>;
    default: React.FC<MdxContentProps>;
}

export interface PostInfo {
    type: "post";
    title: string;
    created: string;
    updated: string;
    categories: Category[];
    tags: Tag[];
    permalink: string;
    Summary: React.FC;
    Page: React.FC<MdxContentProps>;
}

export interface PageInfo {
    type: "page";
    title: string;
    created: string;
    updated: string;
    permalink: string;
    Summary: React.FC;
    Page: React.FC<MdxContentProps>;
}
