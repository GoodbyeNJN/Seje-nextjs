import dayjs from "dayjs";
import { join, type ParamMap, subst } from "urlcat";

export const parsePageLink = (page: Db.Page) => {
    return page.slug;
};

export const parsePostLink = (post: Db.Post, template: string) => {
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

    const link = subst(template, params);
    const url = join("posts", "/", link);

    return url;
};

export const parseCategoryLink = (category: Db.Category, template: string) => {
    const { id, slug } = category;

    const params: ParamMap = { id, slug };

    const link = subst(template, params);
    const url = join("categories", "/", link);

    return url;
};

export const parseTagLink = (tag: Db.Tag, template: string) => {
    const { id, slug } = tag;

    const params: ParamMap = { id, slug };

    const link = subst(template, params);
    const url = join("tags", "/", link);

    return url;
};
