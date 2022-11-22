import { Article } from "client/components";
import Head from "next/head";
import { db } from "server/db";
import { getTitle } from "share/utils";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";

export interface PostProps {
    post: Db.Post;
    categories: Db.Category[];
    tags: Db.Tag[];
}

export interface PostParams extends ParsedUrlQuery {
    post: string[];
}

const Post: NextPage<PostProps> = props => {
    const { post, categories, tags } = props;

    return (
        <>
            <Head>
                <title>{getTitle(post.title)}</title>
            </Head>

            <Article post={post} categories={categories} tags={tags} showCategories showTags />
        </>
    );
};

export const getStaticPaths: GetStaticPaths<PostParams> = async () => {
    const links = await db.getPostLinks();
    const paths = links
        .concat("posts")
        .map(link => link.split("/"))
        .map(link => link.filter(subst => subst !== "posts"))
        .map(link => ({ params: { post: link } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps, PostParams> = async context => {
    const notFound = { notFound: true } as const;

    const links = (context.params?.post || []).map(encodeURIComponent);

    if (links.length === 0) {
        return notFound;
    }

    const link = ["posts", ...links].join("/");
    const post = await db.getPostByLink(link);

    if (!post) {
        return notFound;
    }

    const categories = await db.getCategoriesByPostId(post.id);
    const tags = await db.getTagsByPostId(post.id);

    return { props: { post, categories, tags } };
};

export default Post;
