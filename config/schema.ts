import { z } from "zod";

export const userConfigSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    author: z.string(),

    permalink: z.object({
        site: z.string(),
        post: z.string(),
        page: z.string(),
        category: z.string(),
        tag: z.string(),
    }),

    home: z.object({
        showExcerpt: z.boolean(),
        showReadMore: z.boolean(),
        postsPerPage: z.number(),
    }),

    menu: z.object({
        defaultItems: z.object({
            home: z.literal(false).or(z.string()),
            archives: z.literal(false).or(z.string()),
            categories: z.literal(false).or(z.string()),
            tags: z.literal(false).or(z.string()),
        }),

        customItems: z.record(z.string()),
    }),

    footer: z.object({
        showCopyright: z.boolean(),
    }),

    code: z.object({
        theme: z.tuple([z.string(), z.string()]).or(z.tuple([z.string()])),
    }),
});

export const partialUserConfigSchema = userConfigSchema.deepPartial();

export type UserConfig = z.output<typeof userConfigSchema>;
export type Schema = z.output<typeof partialUserConfigSchema>;
