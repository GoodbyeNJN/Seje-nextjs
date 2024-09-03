import { notFound } from "next/navigation";
import { drop, map, pipe, prop } from "remeda";

import { GroupPostList } from "client/components/GroupPostList";
import { Label } from "client/components/Label";
import { getCategories, getCategoryByPermalink } from "server/api/categories";
import { getPostMetadataByCategory } from "server/api/metadata";
import { getNavbarItemByHref } from "server/api/navbar";
import { slugToPermalink } from "utils/string";

import type { Metadata } from "next";

export interface Params {
    slug: string[];
}

interface Props {
    params: Params;
}

type StaticParams = Params[];

const item = await getNavbarItemByHref("/categories");
const title = item?.label || "分类";

const getPermalinkFromProps = (props: Props) =>
    slugToPermalink(["categories", ...props.params.slug], true);

const Page = async (props: Props) => {
    const categories = await getCategories();
    const permalink = getPermalinkFromProps(props);
    const category = await getCategoryByPermalink(permalink);
    if (!category) {
        notFound();
    }

    const metadata = await getPostMetadataByCategory(category);

    return (
        <>
            <section className="flex">
                <p className="mr-5 flex-shrink-0">{title}</p>

                <Label current={category} list={categories} isCategory />
            </section>

            <section className="border-t border-seje-border py-4">
                <GroupPostList list={metadata} />
            </section>
        </>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const categories = await getCategories();
    const params = pipe(
        categories,
        map(prop("slug")),
        map(drop(1)),
        map(slug => ({ slug })),
    );

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const permalink = getPermalinkFromProps(props);
    const { title: categoryTitle } = (await getCategoryByPermalink(permalink)) || {};

    return categoryTitle ? { title: `${title}: ${categoryTitle}` } : {};
};

export default Page;
