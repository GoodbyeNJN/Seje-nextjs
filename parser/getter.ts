import _ from "lodash";

import { parseFile } from "./file";
import { isPage, isPost } from "./utils";

/** 获取所有 markdowns */
export const getMarkdowns = async () => await parseFile();

/** 获取所有 posts */
export const getPosts = async () => (await getMarkdowns()).filter(isPost);

/** 获取所有 pages */
export const getPages = async () => (await getMarkdowns()).filter(isPage);

/** 根据 permalink 获取 markdown */
export const getMarkdownByPermalink = async (permalink: string) =>
    (await getMarkdowns()).find(markdown => markdown.permalink === permalink);

/** 获取所有 categories */
export const getCategories = async () =>
    _.uniqBy(
        (await getPosts()).flatMap(post => post.categories),
        "slug",
    );

/** 获取所有 tags */
export const getTags = async () =>
    _.uniqBy(
        (await getPosts()).flatMap(post => post.tags),
        "slug",
    );

/** 根据 slug 获取 category */
export const getCategoryBySlug = async (slug: string) =>
    (await getCategories()).find(category => category.slug === slug);

/** 根据 slug 获取 tag */
export const getTagBySlug = async (slug: string) =>
    (await getTags()).find(tag => tag.slug === slug);

/** 根据 permalink 获取 category */
export const getCategoryByPermalink = async (permalink: string) =>
    (await getCategories()).find(category => category.permalink === permalink);

/** 根据 permalink 获取 tag */
export const getTagByPermalink = async (permalink: string) =>
    (await getTags()).find(tag => tag.permalink === permalink);

/** 根据分页参数获取 posts */
export const getPostsByPage = async (page: number, pageSize: number) =>
    (await getPosts()).slice((page - 1) * pageSize, page * pageSize);

/** 根据 category 获取 posts */
export const getPostsByCategorySlug = async (slug: string) =>
    (await getPosts()).filter(post => post.categories.find(category => category.slug === slug));

/** 根据 tag 获取 posts */
export const getPostsByTagSlug = async (slug: string) =>
    (await getPosts()).filter(post => post.tags.find(tag => tag.slug === slug));

/** 根据 category 获取 post permalinks */
export const getPostPermalinksByCategorySlug = async (slug: string) =>
    (await getPostsByCategorySlug(slug)).map(post => post.permalink);

/** 根据 tag 获取 post permalinks */
export const getPostPermalinksByTagSlug = async (slug: string) =>
    (await getPostsByTagSlug(slug)).map(post => post.permalink);

/** 根据 category 和分页参数获取 posts */
export const getPostsByCategoryAndPage = async (slug: string, page: number, pageSize: number) =>
    (await getPostsByCategorySlug(slug)).slice((page - 1) * pageSize, page * pageSize);

/** 根据 tag 和分页参数获取 posts */
export const getPostsByTagAndPage = async (slug: string, page: number, pageSize: number) =>
    (await getPostsByTagSlug(slug)).slice((page - 1) * pageSize, page * pageSize);
