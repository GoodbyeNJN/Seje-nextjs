import { Article } from "client/components";
import Head from "next/head";
import { getPostList } from "server/api";
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
    const posts = await getPostList();

    return { props: { posts } };
};

export default Home;
