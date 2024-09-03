import { hasAtLeast } from "remeda";

import { visitAsync } from "server/utils/unified";

import type { Link, Root, Text } from "mdast";
import type { Paragraph } from "node_modules/strip-markdown/lib";
import type { Navbar } from "server/types";
import type { Transformer } from "unified";
import type { Node, Parent } from "unist";

interface TextLink extends Link {
    children: [Text, ...Text[]];
}

interface LinkParagraph extends Paragraph {
    children: [TextLink, ...TextLink[]];
}

const isListItemParagraph = (
    node: Node,
    index?: number,
    parent?: Parent,
): node is LinkParagraph => {
    if (node.type !== "paragraph" || parent?.type !== "listItem") return false;

    const paragraph = node as Paragraph;
    if (!hasAtLeast(paragraph.children, 1) || paragraph.children[0].type !== "link") {
        return false;
    }

    const link = paragraph.children[0];
    if (!hasAtLeast(link.children, 1) || link.children[0].type !== "text") {
        return false;
    }

    return true;
};

export const remarkCollectList = (): Transformer<Root> => async (tree, file, next) => {
    await visitAsync(tree, isListItemParagraph, async node => {
        const link = node.children[0];
        const text = link.children[0];

        const data = file.data as { list?: Navbar };

        data.list ||= [];
        data.list.push({
            label: text.value,
            href: link.url,
        });
    });

    next(undefined, tree, file);
};
