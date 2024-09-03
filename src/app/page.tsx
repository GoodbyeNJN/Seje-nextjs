import { blogConfig } from "virtual-blog-config";

import { LoadMore } from "client/components/LoadMore";
import { PostList } from "client/components/PostList";
import { getLocalSummaryByPagination } from "server/api/components";
import { groupPostMetadataByPagination } from "server/api/metadata";

const Page: React.FC = async () => {
    const { showLoadMore, postsPerPage } = blogConfig.home;

    const metadata = await groupPostMetadataByPagination(postsPerPage);
    const { list, hasMore } = await getLocalSummaryByPagination(metadata, 1);

    return (
        <>
            <PostList list={list} />

            {showLoadMore && hasMore && <LoadMore metadata={metadata} />}
        </>
    );
};

export default Page;
