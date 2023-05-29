import { PostList } from "@/components";
import { getPageTitles } from "@/config";
import { getPosts } from "@/parser";

const title = getPageTitles().archives;

const Page = async () => {
    const posts = await getPosts();

    return (
        <section>
            <PostList list={posts} />
        </section>
    );
};

export const metadata = {
    title,
};

export default Page;
