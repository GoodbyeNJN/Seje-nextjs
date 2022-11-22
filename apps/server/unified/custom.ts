import { isElement } from "./utils";

import type { Root } from "hast";
// @ts-ignore
import type { Transformer } from "unified";

export const rehypeCustom = (): Transformer<Root> => async (tree, file, next) => {
    const { remove } = await import("unist-util-remove");

    remove(tree, node => isElement(node, "hr"));

    next(null, tree);
};
