import { is } from "unist-util-is";

import type { Element, Node } from "hast";

export const isElement = (node?: Node, tagName?: string): node is Element => {
    if (!is(node, "element")) {
        return false;
    }

    if (!tagName) {
        return true;
    }

    return (node as Element).tagName === tagName;
};
