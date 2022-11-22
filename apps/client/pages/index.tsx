import { Article } from "client/components";
import Head from "next/head";
import { db } from "server/db";
import { blogConfig } from "share/config";

import type { GetStaticProps, NextPage } from "next";

export interface HomeProps {
    posts: Db.Post[];
}

const Home: NextPage<HomeProps> = props => {
    const { posts } = props;
    const { title, showExcerpt, showReadMore } = blogConfig;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            {posts.map(post => (
                <Article
                    key={post.id}
                    post={post}
                    isTitleLink
                    showExcerpt={showExcerpt}
                    showReadMore={showReadMore}
                />
            ))}
        </>
    );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const { showExcerpt, postsPerPage } = blogConfig;

    const posts = await db.getPosts({ pageNumber: 1, pageSize: postsPerPage });
    const postsWithoutExcerpt = posts.map<Db.Post>(post => ({ ...post, excerpt: "" }));
    const postsWithoutContent = posts.map<Db.Post>(post => ({ ...post, content: "" }));

    return { props: { posts: showExcerpt ? postsWithoutContent : postsWithoutExcerpt } };
};

export default Home;
