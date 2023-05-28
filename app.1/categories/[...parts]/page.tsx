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

const getCategory = async (params: Param) => {
    const { parts } = params;
    const pathname = joinPathname(...parts);
    const category = await db.category.findUnique({
        where: { pathname },
        include: { posts: { orderBy: { date: "desc" } } },
    });

    return category;
};

const Page = async (props: Props) => {
    const categories = await db.category.findMany();
    const category = await getCategory(props.params);

    if (!category) {
        notFound();
    }

    return (
        <>
            <section className="flex items-center pb-4">
                <p className="mr-5 flex-shrink-0">分类</p>

                <Label current={category} list={categories} isCategory />
            </section>

            <section className="border-seje-border border-t py-4">
                <PostList list={category.posts} />
            </section>
        </>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const categories = await db.category.findMany();
    const params = categories
        .map(({ pathname }) => ({
            parts: separatePathname(pathname),
        }))
        .concat({ parts: [] });

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const category = await getCategory(props.params);

    return category?.slug ? { title: category.slug } : {};
};

export default Page;
