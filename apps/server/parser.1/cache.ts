import _ from "lodash";
import { db } from "server/db";

export const getCacheDiffs = async (
    files: Parser.FileMap,
    isWatchMode?: boolean,
): Promise<Parser.CacheMap> => {
    await db.reload();

    const { posts, pages } = files;

    const remove = _.differenceBy(db.caches, [...posts, ...pages], "path");

    const diff = <T extends Parser.File, U>(target: T[], source: U[]): Parser.CacheDiff<T> => ({
        create: _.differenceBy(target, source, "path"),
        update: _.differenceBy(
            _.intersectionBy(target, source, "path"),
            _.intersectionBy(source, target, "path"),
            isWatchMode ? "mtime" : "hash",
        ),
        remove,
    });

    return {
        posts: diff(posts, db.caches),
        pages: diff(pages, db.caches),
    };
};

export const putCacheDiffs = async (diffs: Parser.CacheMap) => {
    await db.reload();

    const { posts, pages } = diffs;
    const create = [...posts.create, ...pages.create];
    const update = [...posts.update, ...pages.update];
    const remove = [...posts.remove, ...pages.remove];

    const caches = _.chain<Parser.CacheFile>(update)
        .unionBy(db.caches, "path")
        .xorBy(remove, "path")
        .concat(create)
        .map(({ path, mtime, hash }) => ({ path, mtime, hash }))
        .value();

    await db.merge({ caches });
};

export const parseCacheDiff = (diffs: Parser.CacheMap): Parser.FileMap => {
    const { posts, pages } = diffs;

    return {
        posts: posts.create.concat(posts.update),
        pages: pages.create.concat(pages.update),
    };
};
