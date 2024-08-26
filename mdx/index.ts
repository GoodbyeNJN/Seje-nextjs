import { compile } from "@mdx-js/mdx";
import { recmaImportImages } from "recma-import-images";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

// import { rehypeCode, remarkCode } from "./code";
import { recmaContent } from "./content";
import { recmaDebug } from "./debug";
import { remarkExport } from "./export";
import { rehypeImage } from "./image";
import { recmaSummary } from "./summary";

import type { NextMDXOptions } from "@next/mdx";
import type { VFile } from "vfile";

export const mdxOptions: NextMDXOptions = {
    extension: /\.mdx?$/,

    options: {
        remarkPlugins: [
            // 解析 markdown gfm 拓展语法
            remarkGfm,
            // 解析 frontmatter
            remarkFrontmatter,
            remarkExport,
            // remarkCode,
        ],
        rehypePlugins: [rehypeImage /* , rehypeCode */],
        recmaPlugins: [
            recmaContent,
            recmaSummary,
            // 将 src 引入本地图片转换为 import 引入本地图片
            recmaImportImages,
            // recmaDebug,
        ],
    },
};

export const mdxCompile = async (file: VFile, content: string) => {
    const { value } = await compile(
        { ...file, value: content },
        {
            development: import.meta.env.DEV,
            rehypePlugins: [rehypeImage /* , rehypeCode */],
            recmaPlugins: [
                // 将 src 引入本地图片转换为 import 引入本地图片
                recmaImportImages,
            ],
        },
    );

    return value.toString();
};
