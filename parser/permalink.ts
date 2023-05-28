import dayjs from "dayjs";

import type { Db } from "@/prisma";
import { generatePath, joinPathname, type ParamMap } from "@/utils/url";

export const parsePageLink = (page: Pick<Db.Page, "id" | "title" | "slug">, template: string) => {
    const { id, title, slug } = page;
    const params: ParamMap = { id, title, slug };

    const link = generatePath(template, params);

    return joinPathname(link);
};

export const parsePostLink = (
    post: Pick<Db.Post, "id" | "title" | "slug" | "date">,
    template: string,
) => {
    const { id, title, slug } = post;
    const date = dayjs(post.date);

    const params: ParamMap = {
        id,
        title,
        slug,
        YYYY: date.format("YYYY"),
        YY: date.format("YY"),
        MM: date.format("MM"),
        M: date.format("M"),
        DD: date.format("DD"),
        D: date.format("D"),
    };

    const link = generatePath(template, params);

    return joinPathname(link);
};

export const parseCategoryLink = (category: Pick<Db.Category, "id" | "slug">, template: string) => {
    const { id, slug } = category;

    const params: ParamMap = { id, slug };

    const link = generatePath(template, params);

    return joinPathname(link);
};

export const parseTagLink = (tag: Pick<Db.Tag, "id" | "slug">, template: string) => {
    const { id, slug } = tag;

    const params: ParamMap = { id, slug };

    const link = generatePath(template, params);

    return joinPathname(link);
};
