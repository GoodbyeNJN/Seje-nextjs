import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import { unified } from "unified";

import { blogConfig } from "@/config";

import { rehypeCustom, rehypeImage, rehypeShikiTwoslash } from "../unified";

import type { Options as ShikiOptions } from "remark-shiki-twoslash";

const getShikiOptions = () => {
    const options: ShikiOptions = {};

    const { theme } = blogConfig.code;

    if (theme.length === 1) {
        options.theme = theme[0];
    } else {
        options.themes = theme;
    }

    // if (paths.themes) {
    //     options.paths = { themes: paths.themes.endsWith("/") ? paths.themes : paths.themes + "/" };
    // }

    return options;
};

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkShikiTwoslash, getShikiOptions())
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShikiTwoslash)
    .use(rehypeImage, { dir: process.env.BLOG_PATH })
    .use(rehypeCustom)
    .use(rehypeStringify, { allowDangerousHtml: true });

export const parseContent = async (content: string) => {
    const res = await processor.process(content);

    return res.value as string;
};
