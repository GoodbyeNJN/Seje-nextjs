import dayjs from "dayjs";

import { blogConfig } from "@/config";
import { Category, Post, Tag } from "@/db";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { createCategory, removeCategory } from "./category";
import { parseContent } from "./content";
import { parseFile, parsePostFile } from "./file";
import { parsePostLink } from "./permalink";
import { createTag, removeTag } from "./tag";
import { diff } from "./utils";

import type { PostFile } from "./types";

const getPostLink = (post: Post) => {
    const pathname = parsePostLink(post, blogConfig.permalink.post);
    const permalink = joinPathname("posts", post.pathname);

    return { pathname, permalink };
};

const getPageContent = async (post: Post, postFile: PostFile) => {
    const { contentHash } = postFile;

    let excerpt = post.excerpt;
    let content = post.content;
    if (post.contentHash !== contentHash) {
        content = await parseContent(postFile.content);
        excerpt = postFile.excerpt ? await parseContent(postFile.excerpt) : content;
    }

    return { contentHash, excerpt, content };
};

const getCategories = async (postFile: PostFile) => {
    const { create } = diff(
        postFile.categories,
        (await Category.find()).map(({ slug }) => slug),
    );

    const categories: Category[] = [];
    for (const slug of create) {
        categories.push(await createCategory(slug));
    }

    return { categories };
};

const getTags = async (postFile: PostFile) => {
    const { create } = diff(
        postFile.tags,
        (await Tag.find()).map(({ slug }) => slug),
    );

    const tags: Tag[] = [];
    for (const slug of create) {
        tags.push(await createTag(slug));
    }

    return { tags };
};

const removeCategories = async (post: Post, postFile: PostFile) => {
    const categories = (await Category.findBy({ posts: { id: post.id } })).map(({ slug }) => slug);
    console.log("🚀 ~ file: post.ts:75 ~ disconnectCategory ~ categories:", categories);

    const { remove } = diff(postFile.categories, categories);
    console.log("🚀 ~ file: post.ts:78 ~ disconnectCategory ~ remove:", remove);

    for (const slug of remove) {
        await removeCategory(slug);
    }
};

const removeTags = async (post: Post, postFile: PostFile) => {
    const tags = (await Tag.findBy({ posts: { id: post.id } })).map(({ slug }) => slug);
    console.log("🚀 ~ file: post.ts:80 ~ disconnectTag ~ tags:", tags);

    const { remove } = diff(postFile.tags, tags);
    console.log("🚀 ~ file: post.ts:83 ~ disconnectTag ~ remove:", remove);

    for (const slug of remove) {
        await removeTag(slug);
    }
};

export const createPost = async (filepath: string) => {
    const postFile = parsePostFile(await parseFile(filepath));
    const { filePath, fileHash, contentHash, title, slug, date } = postFile;
    const day = dayjs(date);

    const post = new Post({
        filePath,
        fileHash,
        contentHash,
        title,
        slug,
        date: day.toDate(),
        year: day.year(),
        month: day.month() + 1,
    });
    post.assign(await getPageContent(post, postFile));
    await post.save();

    // 根据更新后的数据，更新链接
    post.assign(getPostLink(post));

    // 新增分类和标签
    post.assign({
        ...(await getCategories(postFile)),
        ...(await getTags(postFile)),
    });

    await post.save();
    logger.info(`Post created: ${slug}`);

    return post;
};

export const updatePost = async (filepath: string) => {
    const postFile = parsePostFile(await parseFile(filepath));
    const { filePath, fileHash, title, slug, date } = postFile;
    const day = dayjs(date);

    const post = await Post.findOneBy({ filePath });
    if (!post) {
        return;
    }

    post.assign({
        fileHash,
        title,
        slug,
        date: day.toDate(),
        year: day.year(),
        month: day.month() + 1,
    });
    post.assign(await getPageContent(post, postFile));

    // 根据更新后的数据，更新链接
    post.assign(getPostLink(post));

    // 新增分类和标签
    post.assign({
        ...(await getCategories(postFile)),
        ...(await getTags(postFile)),
    });

    // 删除分类和标签
    await removeCategories(post, postFile);
    await removeTags(post, postFile);

    await post.save();
    logger.info(`Post updated: ${slug}`);

    return post;
};

export const removePost = async (filePath: string) => {
    const post = await Post.findOneBy({ filePath });
    if (!post) {
        return null;
    }

    await post.remove();
    logger.info(`Post removed: ${post.slug}`);

    return post;
};

export const dispatchPosts = async (filepaths: string[]) => {
    const posts = (await Post.find()).map(({ filePath }) => filePath);
    const { create, update, remove } = diff(filepaths, posts);

    for (const filepath of create) {
        await createPost(filepath);
    }

    for (const filepath of update) {
        await updatePost(filepath);
    }

    for (const filepath of remove) {
        await removePost(filepath);
    }
};
