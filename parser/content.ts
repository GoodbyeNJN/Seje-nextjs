import { compileMDX } from "next-mdx-remote/rsc";
import { createElement } from "react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { Code, ImageWithPreview, Link } from "@/components";
import { rehypeCode, rehypeImage } from "@/unified";
import { getHash } from "@/utils/hash";

import { getRehypePrettyCodeOptions } from "./options";

type Components = Partial<{
    [TagName in keyof JSX.IntrinsicElements]:
        | keyof JSX.IntrinsicElements
        | React.ComponentType<JSX.IntrinsicElements[TagName]>;
}>;

let CONTENT_CACHE: Record<string, React.ReactElement> = {};

const components: Components = {
    a: props => createElement(Link, props),
    img: props => createElement(ImageWithPreview, props),
    div: props => createElement(Code, { ...props, type: "div" }),
    span: props => createElement(Code, { ...props, type: "span" }),
};

const rehypePrettyCodeOptions = getRehypePrettyCodeOptions();

export const parseContent = async (source: string) => {
    const hash = getHash(source);
    const cache = CONTENT_CACHE[hash];
    if (cache) {
        return cache;
    }

    const { content } = await compileMDX({
        source,
        components,
        options: {
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    [rehypePrettyCode, rehypePrettyCodeOptions],
                    rehypeCode,
                    rehypeImage,
                ],
            },
        },
    });

    CONTENT_CACHE[hash] = content;
    return content;
};
