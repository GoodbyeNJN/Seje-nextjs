import _ from "lodash";
import { rehypeCustom, rehypeImage, remarkShiki } from "server/unified";

let prev = 0;
const logger = (str: string) => {
    const next = Date.now();
    console.log(`[${prev ? next - prev : prev}ms] ${str}`);
    prev = next;
};

let processor: ((content: string) => Promise<string>) | null = null;
const getProcessor = async () => {
    if (processor) {
        return processor;
    }

    const { default: rehypeRaw } = await import("rehype-raw");
    const { default: rehypeStringify } = await import("rehype-stringify");
    const { default: remarkGfm } = await import("remark-gfm");
    const { default: remarkParse } = await import("remark-parse");
    const { default: remarkRehype } = await import("remark-rehype");
    const { unified } = await import("unified");

    // processor = (content: string) =>
    //     unified()
    //         .use(remarkParse)
    //         .use(remarkGfm)
    //         .use(remarkShiki)
    //         .use(remarkRehype, { allowDangerousHtml: true })
    //         .use(rehypeRaw)
    //         .use(rehypeImage)
    //         .use(rehypeCustom)
    //         .use(rehypeStringify, { allowDangerousHtml: true })
    //         .process(content)
    //         .then(file => file.value as string);

    processor = (content: string) => {
        let prev = Date.now();
        const logger = (str: string) => {
            const next = Date.now();
            console.log(`[${next - prev}ms] ${str}`);
            prev = next;
        };

        // logger("start processor");

        return unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkShiki)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeRaw)
            .use(rehypeImage)
            .use(rehypeCustom)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(content)
            .then(file => {
                logger("processor");

                return file.value as string;
            });
    };

    return processor;
};

export const parseMarkdown = async (blog: Db.Blog): Promise<Db.Blog> => {
    prev = 0;
    logger("start markdown");

    const process = await getProcessor();
    logger("get processor");

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

    // const pagePromises = blog.pages.map<Promise<Db.Page>>(async page => ({
    //     ...page,
    //     content: await process(page.content),
    // }));

    // const postPromises = blog.posts.map<Promise<Db.Post>>(async post => {
    //     const { excerpt, content } = post;

    //     const parsedContent = await process(content);
    //     const parsedExcerpt = excerpt === content ? parsedContent : await process(excerpt);

    //     return {
    //         ...post,
    //         content: parsedContent,
    //         excerpt: parsedExcerpt,
    //     };
    // });

    // const [pages, posts] = await Promise.all([
    //     Promise.all(pagePromises),
    //     Promise.all(postPromises),
    // ]);

    logger("parse all");

    return { ...blog, pages, posts };
};
