import dayjs from "dayjs";
import _ from "lodash";
import { db } from "server/db";

export const getPostMap = async (params?: { category?: Db.Category; tag?: Db.Tag }) => {
    let posts: Db.Post[] = [];

    if (!params) {
        posts = await db.getPosts();
    } else if (params.category) {
        posts = await db.getPostsByCategoryId(params.category.id);
    } else if (params.tag) {
        posts = await db.getPostsByTagId(params.tag.id);
    }

    return _.chain(posts)
        .orderBy(post => dayjs(post.date).valueOf(), "desc")
        .map<Db.Post>(post => ({ ...post, excerpt: "", content: "" }))
        .groupBy(post => dayjs(post.date).format("YYYY"))
        .entries()
        .orderBy("0", "desc")
        .value();
};
