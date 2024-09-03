import { GroupPostList } from "client/components/GroupPostList";
import { Label } from "client/components/Label";
import { getPostMetadata } from "server/api/metadata";
import { getNavbarItemByHref } from "server/api/navbar";
import { getTags } from "server/api/tags";

import type { Metadata } from "next";

const item = await getNavbarItemByHref("/tags");
const title = item?.label || "标签";

const Page = async () => {
    const metadata = await getPostMetadata();
    const tags = await getTags();

    return (
        <>
            <section className="flex">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label list={tags} isTag />
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
