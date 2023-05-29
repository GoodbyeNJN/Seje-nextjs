import { Label, PostList } from "@/components";
import { getPageTitles } from "@/config";
import { getCategories, getPosts } from "@/parser";

const title = getPageTitles().categories;

const Page = async () => {
    const posts = await getPosts();
    const categories = await getCategories();

    return (
        <>
            <section className="flex pb-4">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label list={categories} isCategory />
            </section>

            <section className="border-t border-seje-border py-4">
                <PostList list={posts} />
            </section>
        </>
    );
};

export const metadata = {
    title,
};

export default Page;
