import { notFound } from "next/navigation";

import { Label, PostList } from "@/components";
import { getPageTitles } from "@/config";
import { getPostsByTagSlug, getTagByPermalink, getTags } from "@/parser";
import { joinPathname, splitPathname } from "@/utils/url";

import type { Metadata } from "next";

export interface Param {
    parts: string[];
}

interface Props {
    params: Param;
}

type StaticParams = Param[];

const FIRST_PART = "tags";
const title = getPageTitles().tags;

const getTag = async (params: Param) => {
    const { parts } = params;
    const pathname = joinPathname(FIRST_PART, ...parts);
    const tag = await getTagByPermalink(pathname);

    return tag;
};

const Page = async (props: Props) => {
    const tags = await getTags();
    const tag = await getTag(props.params);

    if (!tag) {
        notFound();
    }

    const posts = await getPostsByTagSlug(tag.slug);

    return (
        <>
            <section className="flex pb-4">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label current={tag} list={tags} isTag />
            </section>

            <section className="border-t border-seje-border py-4">
                <PostList list={posts} />
            </section>
        </>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const params = (await getTags()).map(({ slug }) => ({
        parts: splitPathname(slug).filter(part => part !== FIRST_PART),
    }));

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const tag = await getTag(props.params);

    return tag?.slug ? { title: `${title}: ${tag.slug}` } : {};
};

export default Page;
