import { PostList } from "@/components";
import { db } from "@/prisma";

const Page = async () => {
    const posts = await db.post.findMany({
        orderBy: { date: "desc" },
    });

    return (
        <section>
            <PostList list={posts} />
        </section>
    );
};

export default Page;
