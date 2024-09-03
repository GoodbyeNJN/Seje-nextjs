import type { MDXContent } from "mdx/types";

export interface Category {
    title: string;
    permalink: string;
    slug: string[];
}

export type Tag = Category;

export interface Metadata {
    type: "post" | "page";
    title: string;
    permalink: string;
    slug: string[];
    created: string;
    updated: string;
    categories: Category[];
    tags: Tag[];
    description: string;
    keywords: string[];
}

export interface MdxPage {
    metadata: Metadata;
    Component: MDXContent;
}

export interface NavbarItem {
    label: string;
    href: string;
}

export type Navbar = NavbarItem[];
