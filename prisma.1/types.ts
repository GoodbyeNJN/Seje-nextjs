import type {
    Prisma,
    Category as PrismaCategory,
    PrismaClient,
    Page as PrismaPage,
    Post as PrismaPost,
    Tag as PrismaTag,
} from "@prisma/client";

export type { Prisma };

export type TransactionClient = Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export declare namespace Db {
    export type Page = PrismaPage;
    export type Post = PrismaPost;
    export type Category = PrismaCategory;
    export type Tag = PrismaTag;

    export type PostWithCategories = Prisma.PostGetPayload<{
        include: { categories: true };
    }>;

    export type PostWithTags = Prisma.PostGetPayload<{
        include: { tags: true };
    }>;

    export type PostWithCategoriesAndTags = Prisma.PostGetPayload<{
        include: { categories: true; tags: true };
    }>;

    export type CategoryWithPosts = Prisma.CategoryGetPayload<{
        include: { posts: true };
    }>;

    export type TagWithPosts = Prisma.TagGetPayload<{
        include: { posts: true };
    }>;

    export type WithSaveMethod<T> = T & {
        save: (tx?: TransactionClient) => Promise<T>;
    };

    export type WithDeleteMethod<T> = T & {
        delete: (tx?: TransactionClient) => Promise<T>;
    };
}
