import { ArticleList, Label } from "client/components";
import Head from "next/head";
import { getPostMap } from "server/api";
import { db } from "server/db";
import { getTitle } from "share/utils";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";

export interface TagProps {
    tag?: Db.Tag;
    tags: Db.Tag[];
    posts: [string, Db.Post[]][];
}

export interface TagParams extends ParsedUrlQuery {
    tag: string[];
}

const Tag: NextPage<TagProps> = props => {
    const { tag, tags, posts } = props;

    return (
        <>
            <Head>
                <title>{getTitle("标签")}</title>
            </Head>

            <section className="flex items-center pb-4">
                <p className="mr-5 flex-shrink-0">标签</p>

                <Label current={tag} list={tags} isTag />
            </section>

            <section className="border-seje-border border-t py-4">
                <ArticleList map={posts} />
            </section>
        </>
    );
};

export const getStaticPaths: GetStaticPaths<TagParams> = async () => {
    const links = await db.getTagLinks();
    const paths = links
        .concat("tags")
        .map(link => link.split("/"))
        .map(link => link.filter(subst => subst !== "tags"))
        .map(link => link.map(decodeURIComponent))
        .map(link => ({ params: { tag: link } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TagProps, TagParams> = async context => {
    const notFound = { notFound: true } as const;

    const tags = await db.getTags();

    const links = (context.params?.tag || []).map(encodeURIComponent);

    if (links.length === 0) {
        const posts = await getPostMap();

        return { props: { posts, tags } };
    }

    const link = ["tags", ...links].join("/");
    const tag = await db.getTagByLink(link);

    if (!tag) {
        return notFound;
    }

    const posts = await getPostMap({ tag });

    return { props: { posts, tag, tags } };
};

export default Tag;
