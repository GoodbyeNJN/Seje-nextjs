import { Fragment, jsx, jsxs } from "react/jsx-runtime";

import { ImageWithPreview } from "./components/Image";
import { Link } from "./components/Link";
import { Pre } from "./components/Pre";
import { SwitchThemeButton } from "./components/SwitchThemeButton";

import type { MDXComponents } from "mdx/types";

// 替换 mdx 中的组件
export const useMDXComponents = (): MDXComponents => ({
    a: Link,
    img: ImageWithPreview,
    pre: Pre,
    SwitchThemeButton,
});

export const useMDXOptions = () => ({
    Fragment,
    jsx,
    jsxs,
    useMDXComponents: (): MDXComponents => ({
        a: Link,
        img: ImageWithPreview,
        pre: Pre,
    }),
});
