import { getAllPosts } from "./posts";

export const getAllCategories = async () => {
    const posts = await getAllPosts();
    return posts.flatMap(({ categories }) => categories);
};

export const getCategoryBySlug = async (slug: string) => {
    const categories = await getAllCategories();
    return categories.find(category => category.slug === slug);
};

export const getCategoryByPermalink = async (permalink: string) => {
    const categories = await getAllCategories();
    return categories.find(category => category.permalink === permalink);
};
