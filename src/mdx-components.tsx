import { ImageWithPreview, Link, MarkdownWrapper, Pre, SwitchThemeButton } from "./components";

import type { MDXComponents } from "mdx/types";

// 替换 mdx 中的组件
export const useMDXComponents = (components: MDXComponents): MDXComponents => {
    return {
        ...components,
        wrapper: MarkdownWrapper,
        a: Link,
        img: ImageWithPreview,
        pre: Pre,
        SwitchThemeButton,
    };
};
