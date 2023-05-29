import { notFound } from "next/navigation";

import { Label, PostList } from "@/components";
import { getPageTitles } from "@/config";
import { getCategories, getCategoryByPermalink, getPostsByCategorySlug } from "@/parser";
import { joinPathname, splitPathname } from "@/utils/url";

import type { Metadata } from "next";

export interface Param {
    parts: string[];
}

interface Props {
    params: Param;
}

type StaticParams = Param[];

const FIRST_PART = "categories";
const title = getPageTitles().categories;

const getCategory = async (params: Param) => {
    const { parts } = params;
    const pathname = joinPathname(FIRST_PART, ...parts);
    const category = await getCategoryByPermalink(pathname);

    return category;
};

const Page = async (props: Props) => {
    const categories = await getCategories();
    const category = await getCategory(props.params);

    if (!category) {
        notFound();
    }

    const posts = await getPostsByCategorySlug(category.slug);

    return (
        <>
            <section className="flex pb-4">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label current={category} list={categories} isCategory />
            </section>

            <section className="border-t border-seje-border py-4">
                <PostList list={posts} />
            </section>
        </>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const params = (await getCategories()).map(({ slug }) => ({
        parts: splitPathname(slug).filter(part => part !== FIRST_PART),
    }));

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const category = await getCategory(props.params);

    return category?.slug ? { title: `${title}: ${category.slug}` } : {};
};

export default Page;
