import { notFound } from "next/navigation";
import { isEmpty, map, pick, pipe } from "remeda";
import { blogConfig } from "virtual-blog-config";

import { Article } from "client/components/Article";
import { Date } from "client/components/Date";
import { Label } from "client/components/Label";
import { getPageByPermalink } from "server/api/components";
import { getAllMetadata, getMetadataByPermalink } from "server/api/metadata";
import { slugToPermalink } from "utils/string";

import type { Metadata } from "next";

export interface Params {
    slug: string[];
}

interface Props {
    params: Params;
}

type StaticParams = Params[];

const getPermalinkFromProps = (props: Props) => slugToPermalink(props.params.slug, true);

const Page = async (props: Props) => {
    const { showPostTitle, showPageTitle, showCategories, showTags } = blogConfig.page;
    const { showPostDate, showPageDate } = blogConfig.date;

    const permalink = getPermalinkFromProps(props);
    const metadata = await getMetadataByPermalink(permalink);
    const Component = await getPageByPermalink(permalink);
    if (!metadata || !Component) {
        notFound();
    }

    const { type, title, created, updated, categories, tags } = metadata;

    return type === "post" ? (
        <Article
            title={showPostTitle && <h1>{title}</h1>}
            content={<Component />}
            addition={
                <>
                    {showPostDate ? <Date created={created} updated={updated} /> : <i />}

                    {(showCategories || showTags) && (
                        <div className="flex gap-2">
                            {showCategories && !isEmpty(categories) && (
                                <Label list={categories} isCategory />
                            )}

                            {showTags && !isEmpty(tags) && <Label list={tags} isTag />}
                        </div>
                    )}
                </>
            }
        />
    ) : (
        <Article
            title={showPageTitle && <h1>{title}</h1>}
            content={<Component />}
            addition={showPageDate && <Date created={created} updated={updated} />}
        />
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const metadata = await getAllMetadata();
    const params = pipe(metadata, map(pick(["slug"])));

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const permalink = getPermalinkFromProps(props);
    const metadata = await getMetadataByPermalink(permalink);

    return metadata || {};
};

export default Page;
