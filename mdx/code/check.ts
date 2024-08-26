import { isElement } from "../utils";

import type { CodeElement, PreElement } from "./types";
import type { Element } from "hast";
import type { Code } from "mdast";
import type { Node } from "unist";

export const isBlockCodeNode = (node: Node): node is Code => node.type === "code";

export const isPreOrCodeElement = (node: Node): node is Element =>
    isElement(node, "pre") || isElement(node, "code");

const isTextChildrenElement = (node: Element) =>
    R.isArray(node.children) && node.children.length === 1 && node.children[0]?.type === "text";

export const isInlineCodeElement = (node: Node, parent?: Node): node is CodeElement =>
    (isElement(node, "inlineCode") || (isElement(node, "code") && !isElement(parent, "pre"))) &&
    isTextChildrenElement(node);

export const isBlockCodeElement = (node: Node): node is PreElement =>
    isElement(node, "pre") &&
    R.isArray(node.children) &&
    node.children.length === 1 &&
    isElement(node.children[0], "code") &&
    isTextChildrenElement(node.children[0]);
