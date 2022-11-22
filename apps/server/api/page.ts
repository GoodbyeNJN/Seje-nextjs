import dayjs from "dayjs";
import { getClient } from "server/db/index";
import { blogConfig } from "share/config/index";

import { getPosts, getPostsByCategory, getPostsByTag } from "./post";

const prunePostsContent = <T>(posts: T[]) => posts.map<T>(post => ({ ...post, content: "" }));

const prunePostsExcerpt = <T>(posts: T[]) => posts.map<T>(post => ({ ...post, excerpt: "" }));

export const getPostList = async () => {
    const { showExcerpt, postsPerPage } = blogConfig;

    const posts = await getPosts({ pageNumber: 0, pageSize: postsPerPage });

    return showExcerpt ? prunePostsContent(posts) : prunePostsExcerpt(posts);
};

export const getPostMap = async (params?: { category?: Db.Category; tag?: Db.Tag }) => {
    let posts: Db.Post[] = [];

    if (!params) {
        posts = await getPosts();
    } else if (params.category) {
        posts = await getPostsByCategory(params.category);
    } else if (params.tag) {
        posts = await getPostsByTag(params.tag);
    }

    const map = new Map<string, Db.Post[]>();
    prunePostsContent(prunePostsExcerpt(posts)).forEach(post => {
        const year = dayjs(post.date).format("YYYY");

        const posts = map.get(year);
        const value = posts ? [...posts, post] : [post];
        map.set(year, value);
    });

    return Array.from(map);
};

export const getPageLinks = async () => {
    const client = await getClient();

    return client.pages.map(page => page.link);
};

export const getPageByLink = async (link: string) => {
    const client = await getClient();
    const page = client.pages.find(page => page.link === link);

    return page;
};
