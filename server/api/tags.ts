import { flatMap, pipe, prop, uniqueBy } from "remeda";

import { getPostMetadata } from "./metadata";

export const getTags = async () => {
    const metadata = await getPostMetadata();
    const tags = pipe(metadata, flatMap(prop("tags")), uniqueBy(prop("permalink")));

    return tags;
};

export const getTagByPermalink = async (permalink: string) => {
    const tags = await getTags();
    const tag = tags.find(tag => tag.permalink === permalink);

    return tag;
};
