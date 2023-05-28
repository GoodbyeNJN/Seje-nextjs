import dayjs from "dayjs";

import { blogConfig } from "@/config";
import type { Db } from "@/prisma";
import { db } from "@/prisma";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { createCategory, removeCategory } from "./category";
import { parseContent } from "./content";
import { parseFile, parsePostFile } from "./file";
import { parsePostLink } from "./permalink";
import { createTag, removeTag } from "./tag";
import { diff } from "./utils";

import type { PostFile } from "./types";

const updatePostLink = (post: Db.Post) => {
    post.pathname = parsePostLink(post, blogConfig.permalink.post);
    post.permalink = joinPathname("posts", post.pathname);
};

const updatePageContent = async (post: Db.Post, postFile: PostFile) => {
    const content = await parseContent(postFile.content);
    post.excerpt = postFile.excerpt ? await parseContent(postFile.excerpt) : content;
    post.content = content;
};

const connectCategory = async (post: Db.Post, postFile: PostFile) => {
    const { create } = diff(
        postFile.categories,
        (await db.category.findMany()).map(({ slug }) => slug),
    );

    for (const slug of create) {
        await createCategory(slug);
    }

    await db.post.update({
        where: { id: post.id },
        data: {
            categories: {
                connect: postFile.categories.map(slug => ({ slug })),
            },
        },
    });
};

const connectTag = async (post: Db.Post, postFile: PostFile) => {
    const { create } = diff(
        postFile.tags,
        (await db.tag.findMany()).map(({ slug }) => slug),
    );

    for (const slug of create) {
        await createTag(slug);
    }

    await db.post.update({
        where: { id: post.id },
        data: {
            tags: {
                connect: postFile.tags.map(slug => ({ slug })),
            },
        },
    });
};

const disconnectCategory = async (post: Db.Post, postFile: PostFile) => {
    const categories = (
        await db.category.findMany({
            where: { posts: { some: { id: post.id } } },
        })
    ).map(({ slug }) => slug);
    console.log("🚀 ~ file: post.ts:75 ~ disconnectCategory ~ categories:", categories);

    const { remove } = diff(postFile.categories, categories);
    console.log("🚀 ~ file: post.ts:78 ~ disconnectCategory ~ remove:", remove);

    await db.post.update({
        where: { id: post.id },
        data: {
            categories: {
                disconnect: postFile.categories.map(slug => ({ slug })),
            },
        },
    });

    for (const slug of remove) {
        await removeCategory(slug);
    }
};

const disconnectTag = async (post: Db.Post, postFile: PostFile) => {
    const tags = (
        await db.tag.findMany({
            where: { posts: { some: { id: post.id } } },
        })
    ).map(({ slug }) => slug);

    const { remove } = diff(postFile.tags, tags);

    await db.post.update({
        where: { id: post.id },
        data: {
            tags: {
                disconnect: postFile.tags.map(slug => ({ slug })),
            },
        },
    });

    for (const slug of remove) {
        await removeTag(slug);
    }
};

export const createPost = async (filepath: string) => {
    const postFile = parsePostFile(await parseFile(filepath));
    const { filePath, fileHash, contentHash, title, slug, date } = postFile;
    const day = dayjs(date);

    const post = await db.post.create({
        data: {
            filePath,
            fileHash,
            contentHash,
            title,
            slug,
            pathname: "",
            permalink: "",
            date: day.toDate(),
            year: day.year(),
            month: day.month() + 1,
            excerpt: "",
            content: "",
        },
    });

    // 根据更新后的数据，更新链接
    updatePostLink(post);

    // 更新内容
    await updatePageContent(post, postFile);

    // 新增分类和标签
    await connectCategory(post, postFile);
    await connectTag(post, postFile);

    await post.save();

    logger.info(`Post created: ${slug}`);
};

export const updatePost = async (filepath: string) => {
    const postFile = parsePostFile(await parseFile(filepath));
    const { filePath, fileHash, contentHash, title, slug, date } = postFile;
    const day = dayjs(date);

    const post = await db.post.findUnique({
        where: { filePath },
    });
    if (!post) {
        return;
    }

    post.fileHash = fileHash;
    post.title = title;
    post.slug = slug;
    post.date = day.toDate();
    post.year = day.year();
    post.month = day.month() + 1;

    // 根据更新后的数据，更新链接
    updatePostLink(post);

    // 内容哈希不一致，更新内容
    if (post.contentHash !== contentHash) {
        await updatePageContent(post, postFile);
        post.contentHash = contentHash;
    }

    // 新增分类和标签
    await connectCategory(post, postFile);
    await connectTag(post, postFile);

    // 删除分类和标签
    await disconnectCategory(post, postFile);
    // await disconnectTag(post, postFile);

    await post.save();

    logger.info(`Post updated: ${slug}`);
};

export const removePost = async (filePath: string) => {
    const post = await db.post.findUnique({
        where: { filePath },
        include: { categories: true, tags: true },
    });
    if (!post) {
        return;
    }

    await db.post.delete({ where: { filePath } });

    logger.info(`Post removed: ${post.slug}`);
};

export const dispatchPosts = async (filepaths: string[]) => {
    const posts = (await db.post.findMany()).map(({ filePath }) => filePath);
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
