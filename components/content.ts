import { createElement, Fragment } from "react";
import rehypeReact from "rehype-react";
import { unified } from "unified";

import { isServerEnv } from "@/utils/env";

import { Code } from "./code";
import { ImageWithPreview } from "./image";
import { Link } from "./link";

export interface ContentProps {
    content: string;
}

type Components = Partial<{
    [TagName in keyof JSX.IntrinsicElements]:
        | keyof JSX.IntrinsicElements
        | React.ComponentType<JSX.IntrinsicElements[TagName]>;
}>;

const components: Components = {
    pre: props => createElement(Code, props),
    a: props => createElement(Link, props),
    img: props => createElement(ImageWithPreview, props),
};

const parseContent = async (content: string) => {
    const { default: rehypeParse } = isServerEnv
        ? await import("rehype-parse")
        : await import("rehype-dom-parse");

    const res = await unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeReact, {
            createElement,
            Fragment,
            components,
        })
        .process(content);

    return res.result;
};

export const Content = async (props: ContentProps) => {
    const { content } = props;

    return await parseContent(content);
};
