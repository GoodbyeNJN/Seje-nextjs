import { GroupPostList } from "client/components/GroupPostList";
import { getPostMetadata } from "server/api/metadata";
import { getNavbarItemByHref } from "server/api/navbar";

import type { Metadata } from "next";

const Page = async () => {
    const metadata = await getPostMetadata();

    return (
        <section>
            <GroupPostList list={metadata} />
        </section>
    );
};

export const generateMetadata = async (): Promise<Metadata> => {
    const item = await getNavbarItemByHref("/archives");
    const title = item?.label || "归档";

    return { title };
};

export default Page;
