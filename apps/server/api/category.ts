import { getClient } from "server/db/index";

export const getCategoriesByPost = async (post: Db.Post) => {
    const client = await getClient();
    const categories = client.getCategoriesByPostId(post.id);

    return categories;
};

export const getCategoryLinks = async () => {
    const client = await getClient();

    return client.categories.map(category => category.link);
};

export const getCategoryByLink = async (link: string) => {
    const client = await getClient();
    const category = client.categories.find(category => category.link === link);

    return category;
};

export const getCategories = async () => {
    const client = await getClient();

    return client.categories;
};
