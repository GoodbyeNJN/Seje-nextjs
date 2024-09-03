import { flatMap, pipe, prop, uniqueBy } from "remeda";

import { getPostMetadata } from "./metadata";

export const getCategories = async () => {
    const metadata = await getPostMetadata();
    const categories = pipe(metadata, flatMap(prop("categories")), uniqueBy(prop("permalink")));

    return categories;
};

export const getCategoryByPermalink = async (permalink: string) => {
    const categories = await getCategories();
    const category = categories.find(category => category.permalink === permalink);

    return category;
};
