import { notFound } from "next/navigation";

import { Post } from "@/components";
import { getMarkdownByPermalink, getMarkdowns, isPage, isPost, parseContent } from "@/parser";
import { joinPathname, splitPathname } from "@/utils/url";

import type { Metadata } from "next";

export interface Param {
    parts: string[];
}

interface Props {
    params: Param;
}

type StaticParams = Param[];

const getMarkdown = async (params: Param) => {
    const pathname = joinPathname(...params.parts);
    const markdown = await getMarkdownByPermalink(pathname);

    return markdown;
};

export default async (props: Props) => {
    const markdown = await getMarkdown(props.params);

    if (!markdown) {
        notFound();
    }

    const content = await parseContent(markdown.content);

    if (isPage(markdown)) {
        return (
            <article className="flex flex-1 flex-col gap-4 border-t border-seje-border py-4 text-justify first:border-t-0 first:pt-0 last:pb-0">
                {content}
            </article>
        );
    } else if (isPost(markdown)) {
        return (
            <Post
                content={content}
                post={markdown}
                categories={markdown.categories}
                tags={markdown.tags}
                showCategories
                showTags
            />
        );
    } else {
        notFound();
    }
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const params = (await getMarkdowns()).map(({ permalink }) => ({
        parts: splitPathname(permalink),
    }));

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const markdown = await getMarkdown(props.params);

    return markdown?.title ? { title: markdown.title } : {};
};
