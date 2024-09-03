import rehypeShikiPlugin from "@shikijs/rehype";
import {
    transformerMetaHighlight,
    transformerMetaWordHighlight,
    transformerNotationDiff,
    transformerNotationErrorLevel,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
} from "@shikijs/transformers";

import { createDebugger } from "utils/debug";
import { createLogger } from "utils/logger";
import { parseUnknownError } from "utils/parse";
import { parseKeyValuePairs } from "utils/string";

import type { RehypeShikiOptions } from "@shikijs/rehype";
import type { Element, Root } from "hast";
import type { PluginTuple } from "unified";

const logger = createLogger("[rehype-shiki]");
const debug = createDebugger("[rehype-shiki]");

export const rehypeShiki: PluginTuple<[RehypeShikiOptions], Root> = [
    rehypeShikiPlugin,
    {
        themes: {
            light: "one-light",
            dark: "one-dark-pro",
        },
        defaultColor: false,
        defaultLanguage: "plaintext",
        parseMetaString(metaString) {
            // debug.start("Parse meta string");
            try {
                const meta = parseKeyValuePairs(metaString);

                return meta;
            } catch (error) {
                logger.error("无法解析 meta 字符串，请检查错误信息:");
                logger.error(parseUnknownError(error).message);

                return {};
            } finally {
                // debug.end("Parse meta string");
            }
        },
        transformers: [
            transformerMetaHighlight(),
            transformerMetaWordHighlight(),
            transformerNotationHighlight(),
            transformerNotationDiff(),
            transformerNotationWordHighlight(),
            transformerNotationErrorLevel(),
            {
                pre(tree) {
                    tree.properties ||= {};
                    tree.properties["data-language"] = this.options.lang.toLocaleLowerCase();

                    delete tree.properties.style;

                    if (this.options.meta?.title) {
                        tree.properties["data-title"] = this.options.meta.title;
                    }

                    const [child] = tree.children;
                    if (!child || child.type !== "element") return;

                    const codeElement = child as Element;
                    if (codeElement.tagName !== "code") return;

                    tree.children = codeElement.children;
                },
            },
        ],
    },
];
