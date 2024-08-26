import dayjs from "dayjs";

import { getPostAndPageInfo } from "./info";

import type { PostInfo } from "./types";

export const getAllPosts = async () => {
    const info = await getPostAndPageInfo();
    return R.pipe(
        info,
        R.filter((item): item is PostInfo => item.type === "post"),
        R.sortBy([({ created }) => dayjs(created).unix(), "desc"]),
    );
};

export const getPostsByPagination = async (page = 1, limit = 5) => {
    if (!Number.isInteger(page) || page < 1) {
        return { list: [], hasMore: false };
    }

    const posts = await getAllPosts();
    const paginated = R.chunk(posts, limit);
    const list = paginated[page - 1];
    const hasMore = page < paginated.length;

    return list ? { list, hasMore } : { list: [], hasMore: false };
};

export const getPostsGroupByCreatedYear = async () => {
    const posts = await getAllPosts();
    return R.pipe(
        posts,
        R.groupBy(({ created }) => dayjs(created).year().toString()),
        R.entries,
        R.sortBy([R.first, "desc"]),
    );
};

export const getPostsGroupByUpdatedYear = async () => {
    const posts = await getAllPosts();
    return R.pipe(
        posts,
        R.sortBy([({ updated }) => dayjs(updated).unix(), "desc"]),
        R.groupBy(({ updated }) => dayjs(updated).year().toString()),
        R.entries,
        R.sortBy([R.first, "desc"]),
    );
};

export const getPostsByCategory = async (slug: string) => {
    const posts = await getAllPosts();
    return posts.filter(({ categories }) => categories.some(category => category.slug === slug));
};

export const getPostsByTag = async (slug: string) => {
    const posts = await getAllPosts();
    return posts.filter(({ tags }) => tags.some(tag => tag.slug === slug));
};

export const getPostByPermalink = async (permalink: string) => {
    const posts = await getAllPosts();
    return posts.find(post => post.permalink === permalink);
};
