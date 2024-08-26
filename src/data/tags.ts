import { getAllPosts } from "./posts";

export const getAllTags = async () => {
    const posts = await getAllPosts();
    return posts.flatMap(({ tags }) => tags);
};

export const getTagBySlug = async (slug: string) => {
    const tags = await getAllTags();
    return tags.find(tag => tag.slug === slug);
};

export const getTagByPermalink = async (permalink: string) => {
    const tags = await getAllTags();
    return tags.find(tag => tag.permalink === permalink);
};
