import { NextPageButton, PostList } from "components";
import { getPostsByPagination } from "data";

import { blogConfig } from "@/config";

const Page: React.FC = async () => {
    const { showPagination, postsPerPage } = blogConfig.home;

    const posts = await getPostsByPagination(1, postsPerPage);

    return (
        <>
            <PostList list={posts.list} />

            {showPagination && <NextPageButton page={1} hasNext={posts.hasMore} />}
        </>
    );
};

export default Page;
