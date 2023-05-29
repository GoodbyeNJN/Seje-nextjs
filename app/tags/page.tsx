import { Label, PostList } from "@/components";
import { getPageTitles } from "@/config";
import { getPosts, getTags } from "@/parser";

const title = getPageTitles().tags;

const Page = async () => {
    const posts = await getPosts();
    const tags = await getTags();

    return (
        <>
            <section className="flex pb-4">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label list={tags} isTag />
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
