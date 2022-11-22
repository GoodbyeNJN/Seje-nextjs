import { ArticleList, Label } from "client/components";
import Head from "next/head";
import { getPostMap } from "server/api";
import { db } from "server/db";
import { getTitle } from "share/utils";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";

export interface CategoryProps {
    category?: Db.Category;
    categories: Db.Category[];
    posts: [string, Db.Post[]][];
}

export interface CategoryParams extends ParsedUrlQuery {
    category: string[];
}

const Category: NextPage<CategoryProps> = props => {
    const { category, categories, posts } = props;

    return (
        <>
            <Head>
                <title>{getTitle("分类")}</title>
            </Head>

            <section className="flex items-center pb-4">
                <p className="mr-5 flex-shrink-0">分类</p>

                <Label current={category} list={categories} isCategory />
            </section>

            <section className="border-seje-border border-t py-4">
                <ArticleList map={posts} />
            </section>
        </>
    );
};

export const getStaticPaths: GetStaticPaths<CategoryParams> = async () => {
    const links = await db.getCategoryLinks();
    const paths = links
        .concat("categories")
        .map(link => link.split("/"))
        .map(link => link.filter(subst => subst !== "categories"))
        .map(link => link.map(decodeURIComponent))
        .map(link => ({ params: { category: link } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<CategoryProps, CategoryParams> = async context => {
    const notFound = { notFound: true } as const;

    const categories = await db.getCategories();

    const links = (context.params?.category || []).map(encodeURIComponent);

    if (links.length === 0) {
        const posts = await getPostMap();

        return { props: { posts, categories } };
    }

    const link = ["categories", ...links].join("/");
    const category = await db.getCategoryByLink(link);

    if (!category) {
        return notFound;
    }

    const posts = await getPostMap({ category });

    return { props: { posts, category, categories } };
};

export default Category;
