import { notFound } from "next/navigation";

import { Label, PostList } from "@/components";
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

const getTag = async (params: Param) => {
    const { parts } = params;
    const pathname = joinPathname(...parts);
    const tag = await db.tag.findUnique({
        where: { pathname },
        include: { posts: { orderBy: { date: "desc" } } },
    });

    return tag;
};

const Page = async (props: Props) => {
    const tags = await db.tag.findMany();
    const tag = await getTag(props.params);

    if (!tag) {
        notFound();
    }

    return (
        <>
            <section className="flex items-center pb-4">
                <p className="mr-5 flex-shrink-0">标签</p>

                <Label current={tag} list={tags} isTag />
            </section>

            <section className="border-seje-border border-t py-4">
                <PostList list={tag.posts} />
            </section>
        </>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const tags = await db.tag.findMany();
    const params = tags
        .map(({ pathname }) => ({
            parts: separatePathname(pathname),
        }))
        .concat({ parts: [] });

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const tag = await getTag(props.params);

    return tag?.slug ? { title: tag.slug } : {};
};

export default Page;
