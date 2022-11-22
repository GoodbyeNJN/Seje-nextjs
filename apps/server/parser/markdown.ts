import remarkShikiTwoslash from "remark-shiki-twoslash";
import { rehypeCustom, rehypeImage, rehypeShikiTwoslash } from "server/unified";
import { getBlogPath } from "share/utils";

import type { Options as ShikiOptions } from "remark-shiki-twoslash";

const getShikiOptions = (config: Config.Blog) => {
    const options: ShikiOptions = {};

    const { code, paths } = config;

    if (code.theme.length === 1) {
        options.theme = code.theme[0];
    } else {
        options.themes = code.theme;
    }

    if (paths.themes) {
        options.paths = { themes: paths.themes.endsWith("/") ? paths.themes : paths.themes + "/" };
    }

    return options;
};

const getProcessor = async (config: Config.Blog) => {
    const { default: rehypeRaw } = await import("rehype-raw");
    const { default: rehypeStringify } = await import("rehype-stringify");
    const { default: remarkGfm } = await import("remark-gfm");
    const { default: remarkParse } = await import("remark-parse");
    const { default: remarkRehype } = await import("remark-rehype");
    const { unified } = await import("unified");

    return (content: string) =>
        unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkShikiTwoslash, getShikiOptions(config))
            // remarkShikiTwoslash返回值类型定义错误，需要忽略下一行产生的错误
            // @ts-expect-error TS2554
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeRaw)
            .use(rehypeShikiTwoslash)
            .use(rehypeImage, { dir: getBlogPath() })
            .use(rehypeCustom)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(content)
            .then(file => file.value as string);
};

export const parseMarkdown = async (blog: Db.Blog, config: Config.Blog): Promise<Db.Blog> => {
    const process = await getProcessor(config);

    const pages = await Promise.all(
        blog.pages.map<Promise<Db.Page>>(async page => ({
            ...page,
            content: await process(page.content),
        })),
    );

    const posts = await Promise.all(
        blog.posts.map<Promise<Db.Post>>(async post => {
            const { excerpt, content } = post;

            const parsedContent = await process(content);
            const parsedExcerpt = excerpt === content ? parsedContent : await process(excerpt);

            return {
                ...post,
                content: parsedContent,
                excerpt: parsedExcerpt,
            };
        }),
    );

    return { ...blog, pages, posts };
};
