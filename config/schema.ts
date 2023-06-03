import { z } from "zod";

export const userConfigSchema = z.object({
    /** 标题 */
    title: z.string(),
    /** 描述(可选) */
    description: z.string(),
    /** 关键词(可选) */
    keywords: z.array(z.string()),
    /** 作者(可选) */
    author: z.string(),
    /** 地址，所有页面路径都将以这个地址作为前缀 */
    url: z.string().url(),

    /** 首页设置 */
    home: z.object({
        /** 是否只展示文章摘要 */
        showExcerpt: z.boolean(),
        /** 是否展示 ReadMore 按钮 */
        showReadMore: z.boolean(),
        /** 每页展示的文章数量 */
        postsPerPage: z.number(),
    }),

    /** 顶部菜单栏设置 */
    menu: z.object({
        /**
         * 默认菜单项
         *
         * 每一项的值可以为 false 或字符串：
         * 值为 false 时，不展示在菜单栏中；
         * 值为字符串时，展示在菜单栏中，且该项的名称为该字符串。
         */
        defaultItems: z.object({
            /** 主页 */
            home: z.literal(false).or(z.string()),
            /** 归档 */
            archives: z.literal(false).or(z.string()),
            /** 分类 */
            categories: z.literal(false).or(z.string()),
            /** 标签 */
            tags: z.literal(false).or(z.string()),
        }),

        /**
         * 自定义菜单项
         *
         * 每一项的键为菜单项的名称，值为菜单项的链接。
         * 其中链接可以是以 / 开头的相对路径，也可以是完整的 URL。
         *
         * 例如：
         * { "关于": "/about", "GitHub": "https://github.com" }
         */
        customItems: z.record(z.string()),
    }),

    /** 页脚设置 */
    footer: z.object({
        /** 是否展示版权信息 */
        showCopyright: z.boolean(),
    }),

    /** 字体设置 */
    font: z.object({
        /**
         * 字体源选择
         *
         * 默认使用 google 官方源，国内可选择 loli 或 geekzu 镜像源，能加快页面加载速度
         */
        mirror: z.enum(["google", "loli", "geekzu"]),
    }),

    /** 代码设置 */
    code: z.object({
        /**
         * 代码主题
         *
         * 可以是一个字符串，也可以是一个对象，例如：{ "dark": "dark-plus", "light": "light-plus" }
         */
        theme: z
            .object({
                dark: z.string(),
                light: z.string(),
            })
            .or(z.string()),

        /** 是否展示语言 */
        showLanguage: z.boolean(),
    }),

    /** 网站跟踪设置 */
    trace: z.object({
        /**
         * Google Analytics
         *
         * 如需启用，请填入 id，例：G-000ABCDEF0
         */
        google: z.string().optional(),
    }),
});

export const partialUserConfigSchema = userConfigSchema.deepPartial();

export type UserConfig = z.output<typeof userConfigSchema>;
export type Schema = z.output<typeof partialUserConfigSchema>;
