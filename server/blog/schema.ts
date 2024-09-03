import { z } from "zod";

export const schema = z
    .object({
        title: z.string().default("Yet Another Blog").describe("网站标题"),
        description: z
            .string()
            .optional()
            .default("Yet another blog powered by Next.js and themed by Seje.")
            .describe("网站描述(可选)"),
        keywords: z.array(z.string()).optional().default([]).describe("网站关键词(可选)"),
        author: z.string().optional().default("").describe("网站作者(可选)"),
        url: z
            .string()
            .url()
            .default("https://example.com")
            .describe("网站地址，所有页面地址都将以此开头"),

        home: z
            .object({
                showSummary: z.boolean().optional().default(true).describe("是否只展示文章摘要"),
                showReadMore: z
                    .boolean()
                    .optional()
                    .default(true)
                    .describe("是否展示 ReadMore 按钮"),
                showLoadMore: z
                    .boolean()
                    .optional()
                    .default(true)
                    .describe("是否展示 LoadMore 按钮"),
                postsPerPage: z.number().optional().default(5).describe("每页展示的文章数量"),
            })
            .optional()
            .default({
                showSummary: true,
                showReadMore: true,
                showLoadMore: true,
                postsPerPage: 5,
            })
            .describe("首页设置"),

        page: z
            .object({
                showPostTitle: z.boolean().optional().default(true).describe("是否展示 post 标题"),
                showPageTitle: z.boolean().optional().default(true).describe("是否展示 page 标题"),
                showCategories: z
                    .boolean()
                    .optional()
                    .default(true)
                    .describe("是否展示分类(仅对 post 生效)"),
                showTags: z
                    .boolean()
                    .optional()
                    .default(true)
                    .describe("是否展示标签(仅对 post 生效)"),
            })
            .optional()
            .default({
                showPostTitle: true,
                showPageTitle: true,
                showCategories: true,
                showTags: true,
            })
            .describe("页面设置"),

        date: z
            .object({
                showPostDate: z.boolean().optional().default(true).describe("是否展示 post 日期"),
                showPageDate: z.boolean().optional().default(true).describe("是否展示 page 日期"),
                showCreatedOrUpdated: z
                    .enum(["created", "updated"])
                    .optional()
                    .default("created")
                    .describe("显示创建日期还是更新日期"),
                showDetailTooltip: z
                    .boolean()
                    .optional()
                    .default(true)
                    .describe("是否展示详细日期提示"),
            })
            .optional()
            .default({
                showPostDate: true,
                showPageDate: true,
                showCreatedOrUpdated: "created",
                showDetailTooltip: true,
            })
            .describe("日期设置"),

        font: z
            .object({
                mirror: z
                    .object({
                        googleapis: z.string(),
                        gstatic: z.string(),
                    })
                    .or(z.enum(["google", "loli", "geekzu"]))
                    .optional()
                    .default("google")
                    .describe(
                        '字体源\n默认使用 google 官方源，国内可选择 loli 或 geekzu 镜像源，也可以自定义其他源，例如: \n{ "googleapis": "https://fonts.example.com", "gstatic": "https://static.example.com" }',
                    ),
            })
            .optional()
            .default({
                mirror: "google",
            })
            .describe("字体设置"),

        code: z
            .object({
                /**
                 * 可以是一个字符串，也可以是一个对象，例如：
                 * `{ "dark": "dark-plus", "light": "light-plus" }`
                 */
                // theme: z
                //     .object({
                //         dark: z.string(),
                //         light: z.string(),
                //     })
                //     .or(z.string())
                //     .optional()
                //     .default({
                //         dark: "dark-plus",
                //         light: "light-plus",
                //     })
                //     .describe("代码主题"),

                showLanguage: z.boolean().optional().default(true).describe("是否展示语言"),
            })
            .optional()
            .default({
                // theme: {
                //     dark: "dark-plus",
                //     light: "light-plus",
                // },
                showLanguage: true,
            })
            .describe("代码设置"),

        trace: z
            .object({
                google: z
                    .string()
                    .optional()
                    .describe("Google Analytics\n如需启用，请填入 id，例: \nG-000ABCDEF0"),

                custom: z
                    .string()
                    .optional()
                    .describe(
                        "自定义网站跟踪脚本\n如需启用，请先将跟踪脚本保存到 ./assets 路径下，并填写脚本文件名，例: \ntrack.js",
                    ),
            })
            .optional()
            .default({})
            .describe("网站跟踪设置"),
    })
    .describe("Seje config schema");

export type BlogConfig = z.output<typeof schema>;
