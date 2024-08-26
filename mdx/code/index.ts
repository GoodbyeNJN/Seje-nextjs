import { visit, visitAsync } from "../utils";

import { parseBlockCode } from "./block";
import {
    isBlockCodeElement,
    isBlockCodeNode,
    isInlineCodeElement,
    isPreOrCodeElement,
} from "./check";
import { initHighlighter } from "./highlighter";
import { parseInlineCode } from "./inline";
import { getTheme as initTheme } from "./theme";

import type { Element, Root as HastRoot } from "hast";
import type { Root as MdastRoot } from "mdast";
import type { Transformer } from "unified";

export const remarkCode = (): Transformer<MdastRoot> => tree => {
    visit(tree, isBlockCodeNode, node => {
        const { lang, meta } = node;

        node.lang = null;
        node.meta = R.filter([lang, meta], R.isTruthy).join(" ");
    });
};

export const rehypeCode = (): Transformer<HastRoot> => {
    const promise = Promise.resolve().then(initHighlighter).then(initTheme);

    return async (tree, file, next) => {
        await promise;

        await visitAsync(tree, isPreOrCodeElement, async (node, index, parent) => {
            if (!parent || R.isNullish(index)) return;

            let child: Element | undefined;
            if (isInlineCodeElement(node, parent)) {
                child = await parseInlineCode(node);
            } else if (isBlockCodeElement(node)) {
                child = await parseBlockCode(node);
            }

            if (child) {
                parent.children[index] = child;
            }
        });

        next(undefined, tree);
    };
};
