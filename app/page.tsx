import { Post } from "@/components";
import { blogConfig } from "@/config";
import { getPostsByPage, parseContent } from "@/parser";

const Page = async () => {
    const { postsPerPage, showExcerpt, showReadMore } = blogConfig.home;

    const posts = await Promise.all(
        (
            await getPostsByPage(1, postsPerPage)
        ).map(async post => ({
            ...post,
            parsed: await parseContent(showExcerpt ? post.excerpt : post.content),
        })),
    );

    return (
        <main>
            {posts.map(post => (
                <Post
                    key={post.permalink}
                    content={post.parsed}
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
