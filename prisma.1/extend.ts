import { Prisma } from "@prisma/client";

import type { TransactionClient } from "./types";

export const save = Prisma.defineExtension(client =>
    client.$extends({
        name: "save",
        result: {
            page: {
                save: {
                    needs: { id: true },
                    compute(data) {
                        return (tx?: TransactionClient) =>
                            (tx || client).page.update({
                                where: { id: data.id },
                                data,
                            });
                    },
                },

                delete: {
                    needs: { id: true },
                    compute(data) {
                        return (tx?: TransactionClient) =>
                            (tx || client).page.delete({
                                where: { id: data.id },
                            });
                    },
                },
            },
            post: {
                save: {
                    needs: { id: true },
                    compute(data) {
                        return async (tx?: TransactionClient) =>
                            (tx || client).post.update({
                                where: { id: data.id },
                                data,
                                include: {
                                    categories: Object.hasOwn(data, "categories"),
                                    tags: Object.hasOwn(data, "tags"),
                                },
                            });
                    },
                },

                delete: {
                    needs: { id: true },
                    compute(data) {
                        return (tx?: TransactionClient) =>
                            (tx || client).post.delete({
                                where: { id: data.id },
                                include: {
                                    categories: Object.hasOwn(data, "categories"),
                                    tags: Object.hasOwn(data, "tags"),
                                },
                            });
                    },
                },
            },
            category: {
                save: {
                    needs: { id: true },
                    compute(data) {
                        return (tx?: TransactionClient) =>
                            (tx || client).category.update({
                                where: { id: data.id },
                                data,
                                include: {
                                    posts: Object.hasOwn(data, "posts"),
                                },
                            });
                    },
                },

                delete: {
                    needs: { id: true },
                    compute(data) {
                        return (tx?: TransactionClient) =>
                            (tx || client).category.delete({
                                where: { id: data.id },
                                include: {
                                    posts: Object.hasOwn(data, "posts"),
                                },
                            });
                    },
                },
            },
            tag: {
                save: {
                    needs: { id: true },
                    compute(data) {
                        return (tx?: TransactionClient) =>
                            (tx || client).tag.update({
                                where: { id: data.id },
                                data,
                                include: {
                                    posts: Object.hasOwn(data, "posts"),
                                },
                            });
                    },
                },

                delete: {
                    needs: { id: true },
                    compute(data) {
                        return (tx?: TransactionClient) =>
                            (tx || client).tag.delete({
                                where: { id: data.id },
                                include: {
                                    posts: Object.hasOwn(data, "posts"),
                                },
                            });
                    },
                },
            },
        },
    }),
);
