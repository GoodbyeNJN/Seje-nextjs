import { notFound } from "next/navigation";
import { drop, map, pipe, prop } from "remeda";

import { GroupPostList } from "client/components/GroupPostList";
import { Label } from "client/components/Label";
import { getPostMetadataByTag } from "server/api/metadata";
import { getNavbarItemByHref } from "server/api/navbar";
import { getTagByPermalink, getTags } from "server/api/tags";
import { slugToPermalink } from "utils/string";

import type { Metadata } from "next";

export interface Params {
    slug: string[];
}

interface Props {
    params: Params;
}

type StaticParams = Params[];

const item = await getNavbarItemByHref("/tags");
const title = item?.label || "标签";

const getPermalinkFromProps = (props: Props) =>
    slugToPermalink(["tags", ...props.params.slug], true);

const Page = async (props: Props) => {
    const tags = await getTags();
    const permalink = getPermalinkFromProps(props);
    const tag = await getTagByPermalink(permalink);
    if (!tag) {
        notFound();
    }

    const metadata = await getPostMetadataByTag(tag);

    return (
        <>
            <section className="flex">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label current={tag} list={tags} isTag />
            </section>

            <section className="border-t border-seje-border py-4">
                <GroupPostList list={metadata} />
            </section>
        </>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const tags = await getTags();
    const params = pipe(
        tags,
        map(prop("slug")),
        map(drop(1)),
        map(slug => ({ slug })),
    );

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const permalink = getPermalinkFromProps(props);
    const { title: tagTitle } = (await getTagByPermalink(permalink)) || {};

    return tagTitle ? { title: `${title}: ${tagTitle}` } : {};
};

export default Page;
