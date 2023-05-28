import { is } from "unist-util-is";

import type { Element, Node } from "hast";

export const isElement = (node: Node, tagName?: string): node is Element => {
    if (!is(node, "element")) {
        return false;
    }

    if (!tagName) {
        return true;
    }

    return (node as Element).tagName === tagName;
};

export const getClassName = (node: Element) => {
    const { className: classes } = node.properties || {};
    const classNames = Array.isArray(classes)
        ? (classes as string[])
        : typeof classes === "string"
        ? classes.split(" ")
        : [];

    return classNames;
};

export const setClassName = (node: Element, className: string[]) => {
    const { properties = {} } = node;
    const { className: classes } = properties;

    const classNames = Array.isArray(classes)
        ? className
        : typeof classes === "string"
        ? className.join(" ")
        : [];

    node.properties = { ...properties, className: classNames };
};

export const hasClassName = (node: Element, className: string) =>
    getClassName(node).includes(className);
