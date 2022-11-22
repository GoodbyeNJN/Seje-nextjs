import { getClient } from "server/db/index";

export const getTagsByPost = async (post: Db.Post) => {
    const client = await getClient();
    const tags = client.getTagsByPostId(post.id);

    return tags;
};

export const getTagLinks = async () => {
    const client = await getClient();

    return client.tags.map(tag => tag.link);
};

export const getTagByLink = async (link: string) => {
    const client = await getClient();
    const tag = client.tags.find(tag => tag.link === link);

    return tag;
};

export const getTags = async () => {
    const client = await getClient();

    return client.tags;
};
