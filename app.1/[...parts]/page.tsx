import { notFound } from "next/navigation";

import { Content } from "@/components";
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

const getPage = async (params: Param) => {
    const { parts } = params;
    const pathname = joinPathname(...parts);
    const page = await db.page.findUnique({
        where: { pathname },
    });

    return page;
};

const Page = async (props: Props) => {
    const page = await getPage(props.params);

    if (!page) {
        notFound();
    }

    return (
        <article className="border-seje-border flex flex-1 flex-col gap-4 border-t py-4 text-justify first:border-t-0 first:pt-0 last:pb-0">
            <Content content={page.content} />
        </article>
    );
};

export const generateStaticParams = async (): Promise<StaticParams> => {
    const pages = await db.page.findMany();
    const params = pages.map(({ pathname }) => ({
        parts: separatePathname(pathname),
    }));

    return params;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const page = await getPage(props.params);

    return page?.title ? { title: page.title } : {};
};

export default Page;
