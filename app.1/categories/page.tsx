import { Label, PostList } from "@/components";
import { db } from "@/prisma";

const Page = async () => {
    const posts = await db.post.findMany({ orderBy: { date: "desc" } });
    const categories = await db.category.findMany({});

    return (
        <>
            <section className="flex items-center pb-4">
                <p className="mr-5 flex-shrink-0">分类</p>

                <Label list={categories} isCategory />
            </section>

            <section className="border-seje-border border-t py-4">
                <PostList list={posts} />
            </section>
        </>
    );
};

export default Page;
