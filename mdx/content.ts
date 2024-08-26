import { builders, traverse } from "estree-toolkit";

import { getPermalink } from "./utils";

import type { FunctionDeclaration, Node, Program, SpreadElement } from "estree-jsx";
import type { NodePath } from "estree-toolkit";
import type { Transformer } from "unified";

const appendPermalink = async (node: Node, permalink: string) => {
    const path = await new Promise<NodePath<SpreadElement> | null>(resolve => {
        traverse(node, {
            FunctionDeclaration(path) {
                if (path.node?.id.name !== "MDXContent") return;

                path.traverse({
                    ReturnStatement(path) {
                        const { argument } = path.node || {};
                        if (
                            argument?.type !== "ConditionalExpression" ||
                            argument.test.type !== "Identifier" ||
                            argument.test.name !== "MDXLayout"
                        ) {
                            return;
                        }

                        path.traverse({
                            ObjectExpression(path) {
                                path.traverse({
                                    SpreadElement(path) {
                                        const { argument } = path.node || {};
                                        if (
                                            argument?.type !== "Identifier" ||
                                            argument.name !== "props"
                                        ) {
                                            return;
                                        }

                                        this.stop();
                                        resolve(path);
                                    },
                                });
                            },
                        });
                    },
                });
            },
        });

        resolve(null);
    });
    if (!path) return;

    const property = builders.property(
        "init",
        builders.identifier("permalink"),
        builders.literal(permalink),
    );
    path.insertAfter([property]);
};

const exportCreateMdxContent = async (node: Node) => {
    const path = await new Promise<NodePath<FunctionDeclaration> | null>(resolve => {
        traverse(node, {
            FunctionDeclaration(path) {
                if (path.node?.id.name !== "_createMdxContent") {
                    return;
                }

                this.stop();
                resolve(path);
            },
        });

        resolve(null);
    });
    if (!path) return;

    const exportedFn = builders.exportNamedDeclaration(path.node);
    path.replaceWith(exportedFn);
};

// markdown 转为 jsx 后，会使用 wrapper 组件包裹
// 为了能够在 wrapper 组件中获取到 permalink，需要给 wrapper 组件的 props 传入 permalink 属性
// 同时导出 _createMdxContent 函数
export const recmaContent = (): Transformer<Program> => async (tree, file, next) => {
    await appendPermalink(tree, getPermalink(file.path));
    await exportCreateMdxContent(tree);

    next(undefined, tree);
};
