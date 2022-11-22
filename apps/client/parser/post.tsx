import { Code, ImageWithPreview, Link } from "client/components";
import { createElement, Fragment } from "react";
// 打包时会被 webpack 替换为 rehype-dom-parse 包
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import { unified } from "unified";

export type ComponentMap = Partial<{
    [TagName in keyof JSX.IntrinsicElements]:
        | keyof JSX.IntrinsicElements
        | React.ComponentType<JSX.IntrinsicElements[TagName]>;
}>;

const components: ComponentMap = {
    pre: props => createElement(Code, props),
    a: props => createElement(Link, props),
    img: props => createElement(ImageWithPreview, props),
};

export const parseCotent = (content: string) =>
    unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeReact, {
            createElement,
            Fragment,
            components,
        })
        .processSync(content).result;
