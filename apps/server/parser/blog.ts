import dayjs from "dayjs";
import deepmerge from "deepmerge";
import _ from "lodash";
import { blogConfig } from "share/config";

import { parseCategoryLink, parsePageLink, parsePostLink, parseTagLink } from "./permalink";

const parsePages = (file: Parser.PageFile[]) =>
    _.chain(file)
        .map<Db.Page>(({ content }) => ({
            id: content.hash,
            title: content.title,
            slug: content.slug,
            link: "",
            content: content.content,
        }))
        .map<Db.Page>(page => ({ ...page, link: parsePageLink(page) }))
        .value();

const parsePosts = (file: Parser.PostFile[]) =>
    _.chain(file)
        .map<Db.Post>(({ content }) => ({
            id: content.hash,
            title: content.title,
            slug: content.slug,
            date: content.date,
            link: "",
            excerpt: content.excerpt,
            content: content.content,
        }))
        .map<Db.Post>(post => ({
            ...post,
            link: parsePostLink(post, blogConfig.url.post),
        }))
        .orderBy(post => dayjs(post.date).valueOf(), "desc")
        .value();

const parseCategories = (file: Parser.PostFile[]) =>
    _.chain(file)
        .map("content")
        .map("categories")
        .flatten()
        .uniqBy("hash")
        .map<Db.Category>(category => ({
            id: category.hash,
            slug: category.content,
            link: "",
        }))
        .map<Db.Category>(category => ({
            ...category,
            link: parseCategoryLink(category, blogConfig.url.category),
        }))
        .value();

const parseTags = (file: Parser.PostFile[]) =>
    _.chain(file)
        .map("content")
        .map("tags")
        .flatten()
        .uniqBy("hash")
        .map<Db.Tag>(tag => ({
            id: tag.hash,
            slug: tag.content,
            link: "",
        }))
        .map<Db.Tag>(tag => ({
            ...tag,
            link: parseTagLink(tag, blogConfig.url.tag),
        }))
        .value();

const parseMappings = (file: Parser.PostFile[]) => {
    const contents = _.map(file, "content");

    const reduce = _.ary(deepmerge, 2);

    const postToCategory = _.chain(contents)
        .map(({ hash, categories }) => ({
            [hash]: _.map(categories, "hash"),
        }))
        .flatten()
        .reduce<Record<string, string[]>>(reduce, {})
        .value();

    const postToTag = _.chain(contents)
        .map(({ hash, tags }) => ({
            [hash]: _.map(tags, "hash"),
        }))
        .flatten()
        .reduce<Record<string, string[]>>(reduce, {})
        .value();

    const categoryToPost = _.chain(contents)
        .map(({ hash, categories }) =>
            _.chain(categories)
                .map(category => ({ [category.hash]: [hash] }))
                .reduce<Record<string, string[]>>(reduce, {})
                .value(),
        )
        .reduce<Record<string, string[]>>(reduce, {})
        .value();

    const tagToPost = _.chain(contents)
        .map(({ hash, tags }) =>
            _.chain(tags)
                .map(tag => ({ [tag.hash]: [hash] }))
                .reduce<Record<string, string[]>>(reduce, {})
                .value(),
        )
        .reduce<Record<string, string[]>>(reduce, {})
        .value();

    return {
        postsCategoriesMap: { ...postToCategory, ...categoryToPost },
        postsTagsMap: { ...postToTag, ...tagToPost },
    };
};

export const parseBlog = (files: Parser.FileMap): Db.Blog => {
    const pages = parsePages(files.pages);
    const posts = parsePosts(files.posts);
    const categories = parseCategories(files.posts);
    const tags = parseTags(files.posts);
    const { postsCategoriesMap, postsTagsMap } = parseMappings(files.posts);

    return { pages, posts, categories, tags, postsCategoriesMap, postsTagsMap };
};
