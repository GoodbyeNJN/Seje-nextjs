import dayjs from "dayjs";

import { getPostAndPageInfo } from "./info";

import type { PageInfo } from "./types";

export const getAllPages = async () => {
    const info = await getPostAndPageInfo();
    return R.pipe(
        info,
        R.filter((item): item is PageInfo => item.type === "page"),
        R.sortBy([({ created }) => dayjs(created).unix(), "desc"]),
    );
};

export const getPageByPermalink = async (permalink: string) => {
    const pages = await getAllPages();
    return pages.find(post => post.permalink === permalink);
};
