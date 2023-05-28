import { Label, PostList } from "@/components";
import { Category, Post } from "@/db";

const Page = async () => {
    const posts = await Post.find({ order: { date: "DESC" } });
    const categories = await Category.find();

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
