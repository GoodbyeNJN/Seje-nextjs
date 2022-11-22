import type { Element, Node } from "hast";

export const isElement = (node: Node, tagName?: string): node is Element => {
    if (node.type !== "element") {
        return false;
    }

    if (!tagName) {
        return true;
    }

    return (node as Element).tagName === tagName;
};
