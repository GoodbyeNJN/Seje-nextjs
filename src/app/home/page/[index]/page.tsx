import { NextPageButton, PostList, PrevPageButton } from "components";
import { getAllPosts, getPostsByPagination } from "data";
import { notFound } from "next/navigation";

import { blogConfig } from "@/config";

export interface Param {
    index: string;
}

interface Props {
    params: Param;
}

type StaticParams = Param[];

const Page: React.FC<Props> = async props => {
    const { params } = props;
    const { showPagination, postsPerPage } = blogConfig.home;

    const index = parseInt(params.index, 10);
    if (!index || index < 0) {
        notFound();
    }

    const posts = await getPostsByPagination(index, postsPerPage);

    return (
        <>
            {showPagination && <PrevPageButton page={index} hasPrev={true} />}

            <PostList list={posts.list} />

            {showPagination && <NextPageButton page={index} hasNext={posts.hasMore} />}
        </>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const { postsPerPage } = blogConfig.home;

    const posts = await getAllPosts();
    const totalPage = Math.ceil(posts.length / postsPerPage);
    const params = Array.from({ length: totalPage - 1 }, (_, index) => ({
        index: (index + 2).toString(),
    }));

    return params;
};

export default Page;
