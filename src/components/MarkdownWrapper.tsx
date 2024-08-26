import { getInfoByPermalink } from "data";
import { notFound } from "next/navigation";

import { blogConfig } from "@/config";

import { Article } from "./Article";
import { Date } from "./Date";
import { Label } from "./Label";

import type { PageInfo, PostInfo } from "data";

export interface WrapperProps {
    permalink: string;
}

const Post: React.FC<React.PropsWithChildren<{ post: PostInfo }>> = props => {
    const { post, children } = props;
    const { title, created, updated, categories, tags, permalink, Summary } = post;
    const { prependPostSummary, showPostCategories, showPostTags } = blogConfig.post;
    const { showDateInPost } = blogConfig.date;

    return (
        <Article
            permalink={permalink}
            title={<h1>{title}</h1>}
            content={
                <>
                    {prependPostSummary && <Summary />}
                    {children}
                </>
            }
            addition={
                <>
                    {showDateInPost ? <Date created={created} updated={updated} /> : <i />}

                    {(showPostCategories || showPostTags) && (
                        <div className="flex gap-2">
                            {showPostCategories && !R.isEmpty(categories) && (
                                <Label list={categories} isCategory />
                            )}

                            {showPostTags && !R.isEmpty(tags) && <Label list={tags} isTag />}
                        </div>
                    )}
                </>
            }
        />
    );
};

const Page: React.FC<React.PropsWithChildren<{ page: PageInfo }>> = props => {
    const { page, children } = props;
    const { title, created, updated, permalink, Summary } = page;
    const { prependPageSummary, showPageTitle } = blogConfig.post;
    const { showDateInPage } = blogConfig.date;

    return (
        <Article
            permalink={permalink}
            title={showPageTitle && <h1>{title}</h1>}
            content={
                <>
                    {prependPageSummary && <Summary />}
                    {children}
                </>
            }
            addition={showDateInPage && <Date created={created} updated={updated} />}
        />
    );
};

// 包裹在 markdown 内容外的组件，用于渲染 post 或 page
export const MarkdownWrapper: React.FC<React.PropsWithChildren<WrapperProps>> = async props => {
    const { permalink, children } = props;

    const info = await getInfoByPermalink(permalink);
    if (!info) {
        notFound();
    }

    return info.type === "post" ? (
        <Post post={info}>{children}</Post>
    ) : (
        <Page page={info}>{children}</Page>
    );
};
