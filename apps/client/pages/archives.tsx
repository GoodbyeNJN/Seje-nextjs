import { ArticleList } from "client/components";
import Head from "next/head";
import { getPostMap } from "server/api";
import { blogConfig } from "share/config";
import { getTitle } from "share/utils";

import type { GetStaticProps, NextPage } from "next";

export interface ArchiveProps {
    posts: [string, Db.Post[]][];
}

const Archive: NextPage<ArchiveProps> = props => {
    const { posts } = props;
    const { menu } = blogConfig;

    return (
        <>
            <Head>
                <title>{getTitle(menu.archive)}</title>
            </Head>

            <section>
                <ArticleList map={posts} />
            </section>
        </>
    );
};

export const getStaticProps: GetStaticProps<ArchiveProps> = async () => {
    const posts = await getPostMap();

    return { props: { posts } };
};

export default Archive;
