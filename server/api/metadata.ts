import dayjs from "dayjs";
import { chunk, entries, filter, first, groupBy, pipe, sortBy } from "remeda";

import { tempMetadataPath } from "server/constants";
import { safeReadJson } from "utils/fs";

import type { Category, Metadata, Tag } from "server/types";

export const getAllMetadata = async () => {
    const manifest = await safeReadJson<Metadata[]>(tempMetadataPath);
    if (!manifest) {
        throw new Error("Manifest not found");
    }

    return manifest;
};

export const getPageMetadata = async () => {
    const manifest = await getAllMetadata();
    const metadata = manifest.filter(({ type }) => type === "page");

    return metadata;
};

export const getPostMetadata = async () => {
    const manifest = await getAllMetadata();
    const metadata = manifest.filter(({ type }) => type === "post");

    return metadata;
};

export const getMetadataByPermalink = async (permalink: string) => {
    const manifest = await getAllMetadata();
    const metadata = manifest.find(metadata => metadata.permalink === permalink);

    return metadata;
};

export const getPostMetadataByCategory = async (category: Category) => {
    const { permalink } = category;
    const metadata = await getPostMetadata();
    const list = pipe(
        metadata,
        filter(({ categories }) => categories.some(category => category.permalink === permalink)),
    );

    return list;
};

export const getPostMetadataByTag = async (tag: Tag) => {
    const { permalink } = tag;
    const metadata = await getPostMetadata();
    const list = pipe(
        metadata,
        filter(({ tags }) => tags.some(tag => tag.permalink === permalink)),
    );

    return list;
};

export const groupPostMetadataByYear = (metadata: Metadata[], type: "created" | "updated") => {
    const list = pipe(
        metadata,
        sortBy([
            ({ created, updated }) => dayjs(type === "created" ? created : updated).unix(),
            "desc",
        ]),
        groupBy(({ created, updated }) =>
            dayjs(type === "created" ? created : updated)
                .year()
                .toString(),
        ),
        entries<Record<string, Metadata[]>>,
        sortBy([first(), "desc"]),
    );

    return list;
};

export const groupPostMetadataByPagination = async (limit = 5) => {
    const metadata = await getPostMetadata();
    const paginated = chunk(metadata, limit);

    return paginated;
};
