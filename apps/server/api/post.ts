import { getClient } from "server/db";

export const getPostsByCategory = async (category: Db.Category) => {
    const client = await getClient();
    const posts = client.getPostsByCategoryId(category.id);

    return posts;
};

export const getPostsByTag = async (tag: Db.Tag) => {
    const client = await getClient();
    const posts = client.getPostsByTagId(tag.id);

    return posts;
};

export const getPostLinks = async () => {
    const client = await getClient();

    return client.posts.map(post => post.link);
};

export const getPostByLink = async (link: string) => {
    const client = await getClient();
    const post = client.posts.find(post => post.link === link);

    return post;
};

export const getPosts = async (params?: { pageNumber: number; pageSize: number }) => {
    const client = await getClient();

    if (!params) {
        return client.posts;
    }

    const { pageNumber, pageSize } = params;
    const posts = client.posts.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);

    return posts;
};
