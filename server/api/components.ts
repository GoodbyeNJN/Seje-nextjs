import { isEmpty } from "remeda";

import { useMDXOptions } from "client/mdx-components";
import { addLeadingSlash, join } from "utils/string";

import type { MDXModule } from "mdx/types";
import type { Metadata } from "server/types";

export const getComponentByType = async (type: "header" | "footer" | "navbar") => {
    try {
        const module = (await import(`../../.temp/components/${type}.jsx`)) as unknown as MDXModule;
        return module.default;
    } catch {
        return null;
    }
};

export const getPageByPermalink = async (permalink: string) => {
    try {
        const module = (await import(`../../.temp/pages${permalink}.jsx`)) as unknown as MDXModule;
        return module.default;
    } catch {
        return null;
    }
};

export const getLocalSummaryByPagination = async (paginated: Metadata[][], page = 1) => {
    const metadata = paginated[page - 1] || [];
    const hasMore = !isEmpty(metadata) && page < paginated.length;

    const list = (
        await Promise.all(
            metadata.map(async metadata => ({
                metadata,
                Module: (await import(`../../public/mdx${metadata.permalink}.js`)).default,
            })),
        )
    ).map(({ Module, ...rest }) => ({
        ...rest,
        Component: Module(useMDXOptions()).default,
    }));

    return { list, hasMore };
};

export const getRemoteSummaryByPagination = async (paginated: Metadata[][], page = 1) => {
    const metadata = paginated[page - 1] || [];
    const hasMore = !isEmpty(metadata) && page < paginated.length;

    const list = (
        await Promise.all(
            metadata
                .map(metadata => ({
                    metadata,
                    resource: addLeadingSlash(
                        join(import.meta.env.BASE_URL, "mdx", metadata.permalink),
                    ),
                }))
                .map(async ({ resource, ...rest }) => ({
                    ...rest,
                    Module: (await import(/* webpackIgnore: true */ `${resource}.js`)).default,
                })),
        )
    ).map(({ Module, ...rest }) => ({
        ...rest,
        Component: Module(useMDXOptions()).default,
    }));

    return { list, hasMore };
};
