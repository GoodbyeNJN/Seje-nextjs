import { PostList } from "@/components";
import { Post } from "@/db";

const Page = async () => {
    const posts = await Post.find({ order: { date: "DESC" } });

    return (
        <section>
            <PostList list={posts} />
        </section>
    );
};

export default Page;
