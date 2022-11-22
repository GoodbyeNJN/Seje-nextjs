import { isUndefined } from "share/utils";

import type { Element, Node, Root, Text } from "hast";

export const isRoot = (node: Node): node is Root => {
    return node.type === "root";
};

export const isText = (node: Node, value?: string): node is Text => {
    if (node.type !== "text") {
        return false;
    }

    if (isUndefined(value)) {
        return true;
    }

    return (node as Text).value === value;
};

export const isElement = (node: Node, tagName?: string): node is Element => {
    if (node.type !== "element") {
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
