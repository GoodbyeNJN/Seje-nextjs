import { Post } from "@/components";
import { blogConfig } from "@/config";
import { db } from "@/prisma";
import "@/styles/globals.css";

const Page = async () => {
    const { postsPerPage, showExcerpt, showReadMore } = blogConfig.home;

    const posts = await db.post.findMany({
        orderBy: { date: "desc" },
        skip: 0,
        take: postsPerPage,
    });

    return (
        <main>
            {posts.map(post => (
                <Post
                    key={post.id}
                    post={post}
                    isTitleLink
                    showExcerpt={showExcerpt}
                    showReadMore={showReadMore}
                />
            ))}
        </main>
    );
};

export default Page;
