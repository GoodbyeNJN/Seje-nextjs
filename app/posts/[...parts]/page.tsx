import { notFound } from "next/navigation";

import { Post } from "@/components";
import { db } from "@/prisma";
import { joinPathname, separatePathname } from "@/utils/url";

import type { Metadata } from "next";

export interface Param {
    parts: string[];
}

interface Props {
    params: Param;
}

type StaticParams = Param[];

const getPostByParams = async (params: Param) => {
    const { parts } = params;
    const pathname = joinPathname(...parts);
    const post = await db.post.findUnique({
        where: { pathname },
        include: { categories: true, tags: true },
    });

    return post;
};

const Page = async (props: Props) => {
    const post = await getPostByParams(props.params);

    if (!post) {
        notFound();
    }

    return (
        <Post post={post} categories={post.categories} tags={post.tags} showCategories showTags />
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const posts = await db.post.findMany();
    const params = posts.map(({ pathname }) => ({
        parts: separatePathname(pathname),
    }));

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const post = await getPostByParams(props.params);

    return post?.title ? { title: post.title } : {};
};

export default Page;
