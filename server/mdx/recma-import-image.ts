import { builders, is, traverse } from "estree-toolkit";
import { randomString } from "remeda";

import { createDebugger } from "utils/debug";

import type { Literal, Program } from "estree-jsx";
import type { Transformer } from "unified";

const debug = createDebugger("[recma-import-image]");

const replaceLocalImgSrc = async (tree: Program) => {
    const map = await new Promise<Map<string, string>>(resolve => {
        const map = new Map<string, string>();

        traverse(tree, {
            JSXOpeningElement(jsxOpeningElement) {
                const name = jsxOpeningElement.get("name");
                const isTargetJSXOpeningElement = is.jsxMemberExpression(name, {
                    object: object => is.jsxIdentifier(object, { name: "_components" }),
                    property: property => is.jsxIdentifier(property, { name: "img" }),
                });
                if (!isTargetJSXOpeningElement) return;

                const attributes = jsxOpeningElement.get("attributes");
                const typeAttribute = attributes.find(attribute =>
                    is.jsxAttribute(attribute, {
                        name: name => is.jsxIdentifier(name, { name: "type" }),
                        value: value => is.literal(value, { value: "local" }),
                    }),
                );
                if (!typeAttribute) return;

                const srcAttribute = attributes.find(attribute =>
                    is.jsxAttribute(attribute, {
                        name: name => is.jsxIdentifier(name, { name: "src" }),
                        value: value => is.literal(value),
                    }),
                );
                if (!srcAttribute) return;

                const src = (srcAttribute.node?.value as Literal).value as string;

                let id = "";
                if (map.has(src)) {
                    id = map.get(src);
                } else {
                    id = `Image$${randomString(4)}`;
                    map.set(src, id);
                }

                srcAttribute.replaceWith(
                    builders.jsxAttribute(
                        builders.jsxIdentifier("src"),
                        builders.jsxExpressionContainer(builders.identifier(id)),
                    ),
                );
            },
        });

        resolve(map);
    });

    const imports = [...map.entries()].map(([src, id]) =>
        builders.importDeclaration(
            [builders.importDefaultSpecifier(builders.identifier(id))],
            builders.literal(src),
        ),
    );
    tree.body.unshift(...imports);
};

// 将 src 引入本地图片转换为 import 引入本地图片
export const recmaImportImage = (): Transformer<Program> => async (tree, file, next) => {
    // debug.start("Main");

    await replaceLocalImgSrc(tree);

    // debug.end("Main");

    next(undefined, tree, file);
};
