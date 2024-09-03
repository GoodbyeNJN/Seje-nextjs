import { GroupPostList } from "client/components/GroupPostList";
import { Label } from "client/components/Label";
import { getCategories } from "server/api/categories";
import { getPostMetadata } from "server/api/metadata";
import { getNavbarItemByHref } from "server/api/navbar";

import type { Metadata } from "next";

const item = await getNavbarItemByHref("/categories");
const title = item?.label || "分类";

const Page = async () => {
    const metadata = await getPostMetadata();
    const categories = await getCategories();

    return (
        <>
            <section className="flex">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label list={categories} isCategory />
            </section>

            <section className="border-t border-seje-border py-4">
                <GroupPostList list={metadata} />
            </section>
        </>
    );
};

export const metadata: Metadata = {
    title,
};

export default Page;
