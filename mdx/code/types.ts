import type { Data, Element, Properties, Root, Text } from "hast";

export interface CodeElement extends Element {
    tagName: "code";
    properties: Properties & {
        className?: string[];
        metastring?: string;
    };
    data?: Data & { meta?: string };
    children: [Text];
}

export interface PreElement extends Element {
    tagName: "pre";
    children: [CodeElement];
}

export interface ShikijiCommonProperties extends Properties {
    class?: string;
    style?: string;
}

export interface ShikijiTokenSpan extends Element {
    tagName: "span";
    properties: ShikijiCommonProperties;
    children: [Text];
}

export interface ShikijiLineSpan extends Element {
    tagName: "span";
    properties: ShikijiCommonProperties;
    children: [ShikijiTokenSpan] | ArrayWithAtLeastOneItem<ShikijiTokenSpan>;
}

export interface ShikijiCode extends Element {
    tagName: "code";
    properties: ShikijiCommonProperties & { "data-language"?: string };
    children: [ShikijiLineSpan] | ArrayWithAtLeastOneItem<ShikijiLineSpan>;
}

export interface ShikijiPre extends Element {
    tagName: "pre";
    properties: ShikijiCommonProperties & {
        "data-language"?: string;
        "data-title"?: string;
        "data-total-line"?: string;
        "data-highlighted-lines"?: string;
        "data-inserted-lines"?: string;
        "data-removed-lines"?: string;
    };
    children: [ShikijiCode];
}

export interface ShikijiRoot extends Root {
    children: [ShikijiPre];
}
