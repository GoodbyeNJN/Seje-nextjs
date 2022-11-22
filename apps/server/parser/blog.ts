import crypto from "crypto";

import dayjs from "dayjs";

import { parseCategoryLink, parsePageLink, parsePostLink, parseTagLink } from "./permalink";

const getHash = (str: string, length = 4) =>
    crypto.createHash("shake256", { outputLength: length }).update(str).digest("hex");

const parsePages = (raw: Parser.PageFileContent[]) =>
    raw
        .map<Db.Page>(page => ({
            id: getHash(page.content),
            title: page.data.title,
            slug: page.data.slug,
            link: "",
            content: page.content,
        }))
        .map<Db.Page>(page => ({ ...page, link: parsePageLink(page) }));

const parsePosts = (raw: Parser.PostFileContent[], config: Config.Blog) =>
    raw
        .map<Db.Post>(post => ({
            id: getHash(post.content),
            title: post.data.title,
            slug: post.data.slug,
            date: post.data.date,
            link: "",
            excerpt: post.excerpt,
            content: post.content,
        }))
        .map<Db.Post>(post => ({
            ...post,
            link: parsePostLink(post, config.url.post),
        }))
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

const parseCategories = (raw: Parser.PostFileContent[], config: Config.Blog) => {
    const categories = new Set<string>();

    raw.forEach(post => {
        post.data.categories.forEach(category => categories.add(category));
    });

    return [...categories]
        .map<Db.Category>(category => ({
            id: getHash(category),
            slug: category,
            link: "",
        }))
        .map<Db.Category>(category => ({
            ...category,
            link: parseCategoryLink(category, config.url.category),
        }));
};

const parseTags = (raw: Parser.PostFileContent[], config: Config.Blog) => {
    const tags = new Set<string>();

    raw.forEach(post => {
        post.data.tags.forEach(tag => tags.add(tag));
    });

    return [...tags]
        .map<Db.Tag>(tag => ({
            id: getHash(tag),
            slug: tag,
            link: "",
        }))
        .map<Db.Tag>(tag => ({
            ...tag,
            link: parseTagLink(tag, config.url.tag),
        }));
};

const parseMappings = (raw: Parser.PostFileContent[]) => {
    const postsCategoriesMap: Record<string, string[]> = {};
    const postsTagsMap: Record<string, string[]> = {};

    raw.forEach(post => {
        const postId = getHash(post.content);

        post.data.categories.forEach(category => {
            const categoryId = getHash(category);
            postsCategoriesMap[postId] = [...(postsCategoriesMap[postId] || []), categoryId];
            postsCategoriesMap[categoryId] = [...(postsCategoriesMap[categoryId] || []), postId];
        });

        post.data.tags.forEach(tag => {
            const tagId = getHash(tag);
            postsTagsMap[postId] = [...(postsTagsMap[postId] || []), tagId];
            postsTagsMap[tagId] = [...(postsTagsMap[tagId] || []), postId];
        });
    });

    return { postsCategoriesMap, postsTagsMap };
};

export const parseBlog = (
    postContents: Parser.PostFileContent[],
    pageContents: Parser.PageFileContent[],
    config: Config.Blog,
) => {
    const pages = parsePages(pageContents);
    const posts = parsePosts(postContents, config);
    const categories = parseCategories(postContents, config);
    const tags = parseTags(postContents, config);
    const { postsCategoriesMap, postsTagsMap } = parseMappings(postContents);

    const blog: Db.Blog = { pages, posts, categories, tags, postsCategoriesMap, postsTagsMap };

    return blog;
};
