import { parseCotent } from "client/parser";
import Head from "next/head";
import { getPageByLink, getPageLinks } from "server/api";
import { getTitle } from "share/utils";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";

export interface PageProps {
    page: Db.Page;
}

export interface PageParams extends ParsedUrlQuery {
    page: string[];
}

const Page: NextPage<PageProps> = props => {
    const { page } = props;
    const { title, content } = page;

    return (
        <>
            <Head>
                <title>{getTitle(title)}</title>
            </Head>

            <article className="border-seje-border flex flex-1 flex-col gap-4 border-t py-4 text-justify first:border-t-0 first:pt-0 last:pb-0">
                {parseCotent(content)}
            </article>
        </>
    );
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
    const links = await getPageLinks();
    const paths = links
        .map(link => link.split("/"))
        .map(link => link.map(decodeURIComponent))
        .map(link => ({ params: { page: link } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps, PageParams> = async context => {
    const notFound = { notFound: true } as const;
    const redirect = { redirect: { permanent: true, destination: "/" } } as const;

    const links = (context.params?.page || []).map(encodeURIComponent);

    if (links.length === 0) {
        return redirect;
    }

    const link = links.join("/");
    const page = await getPageByLink(link);

    if (!page) {
        return notFound;
    }

    return { props: { page } };
};

export default Page;
