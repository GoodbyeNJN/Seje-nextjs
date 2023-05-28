import { remove } from "unist-util-remove";

import { isElement } from "./utils";

import type { Root } from "hast";
import type { Transformer } from "unified";

export const rehypeCustom = (): Transformer<Root> => (tree, file, next) => {
    remove(tree, node => isElement(node, "hr"));

    next(null, tree);
};
