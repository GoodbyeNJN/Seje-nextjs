import { z } from "zod";

export const getUserConfigSchema = () =>
    z.object({
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
            /**
             * 是否只展示文章摘要
             * @default true
             */
            showSummary: z.boolean(),
            /**
             * 是否展示 ReadMore 按钮
             * @default true
             */
            showReadMore: z.boolean(),
            /**
             * 是否展示翻页按钮
             * @default true
             */
            showPagination: z.boolean(),
            /**
             * 每页展示的文章数量
             * @default 5
             */
            postsPerPage: z.number(),
        }),

        /** 博文设置 */
        post: z.object({
            /**
             * 是否将摘要插入到 post 文首
             * @default false
             */
            prependPostSummary: z.boolean(),
            /**
             * 是否将摘要插入到 post 文首
             * @default false
             */
            prependPageSummary: z.boolean(),
            /**
             * 是否展示 post 分类
             * @default true
             */
            showPostCategories: z.boolean(),
            /**
             * 是否展示 post 标签
             * @default true
             */
            showPostTags: z.boolean(),
            /**
             * 是否显示 page 标题
             * @default false
             */
            showPageTitle: z.boolean(),
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
             * @example { 关于: "/about", GitHub: "https://github.com" }
             */
            customItems: z.record(z.string()),
        }),

        /** 页脚设置 */
        footer: z.object({
            /** 是否展示版权信息 */
            showCopyright: z.boolean(),
        }),

        /** 日期设置 */
        date: z.object({
            /**
             * 是否在 post 中展示日期
             * @default true
             */
            showDateInPost: z.boolean(),
            /**
             * 是否在 page 中展示日期
             * @default false
             */
            showDateInPage: z.boolean(),
            /**
             * 展示创建日期还是更新日期
             * @default "created"
             */
            showCreatedOrUpdated: z.enum(["created", "updated"]),
            /**
             * 是否在 tooltip 中展示详细日期信息，包含创建日期和更新日期
             * @default true
             */
            showDetailTooltip: z.boolean(),
        }),

        /** 字体设置 */
        font: z.object({
            /**
             * 字体源选择
             *
             * 默认使用 google 官方源，国内可选择 loli 或 geekzu 镜像源，也可以自定义其他源
             *
             * @default "google"
             * @example { googleapis: "https://fonts.example.com", gstatic: "https://static.example.com" }
             */
            mirror: z
                .object({
                    googleapis: z.string(),
                    gstatic: z.string(),
                })
                .or(z.enum(["google", "loli", "geekzu"])),
        }),

        /** 代码设置 */
        code: z.object({
            /**
             * 代码主题
             *
             * 可以是一个字符串，也可以是一个对象
             *
             * @default { dark: "dark-plus", light: "light-plus" }
             * @example "dark-plus"
             */
            theme: z
                .object({
                    dark: z.string(),
                    light: z.string(),
                })
                .or(z.string()),

            /**
             * 是否展示语言
             * @default true
             */
            showLanguage: z.boolean(),

            /**
             * 是否展示行号
             * @default false
             */
            showLineNumber: z.boolean(),
        }),

        /** 网站跟踪设置 */
        trace: z.object({
            /**
             * Google Analytics
             *
             * 如需启用，请填入 id
             *
             * @example "G-000ABCDEF0"
             */
            google: z.string().optional(),

            /**
             * 自定义
             *
             * 大部分网站跟踪功能都是通过加载脚本实现，如需启用，请先将脚本文件保存到 ./assets 路径下，并填写脚本文件名
             *
             * @example "some-script.js"
             */
            custom: z.string().optional(),
        }),
    });

export const getSchema = () => getUserConfigSchema().deepPartial();

export type UserConfig = z.output<ReturnType<typeof getUserConfigSchema>>;
export type Schema = z.output<ReturnType<typeof getSchema>>;
