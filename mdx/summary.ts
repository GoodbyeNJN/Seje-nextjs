import { builders, traverse } from "estree-toolkit";

import { jsToTree } from "./utils";

import { mdxCompile } from ".";

import type { BlockStatement, Literal, Node, Program } from "estree-jsx";
import type { Transformer } from "unified";

const findSummaryPropertyValue = (node: Node) =>
    new Promise<string | null>(resolve => {
        traverse(node, {
            VariableDeclarator(path) {
                const { id } = path.node || {};
                if (id?.type !== "Identifier" || id.name !== "metadata") {
                    return;
                }

                path.traverse({
                    Property(path) {
                        const { key, value } = path.node || {};
                        if (
                            key?.type !== "Identifier" ||
                            key.name !== "summary" ||
                            value?.type !== "Literal"
                        ) {
                            return;
                        }

                        if (!R.isString(value.value)) return;

                        this.stop();
                        resolve(value.value);
                    },
                });
            },
        });

        resolve(null);
    });

const generateSummaryExport = async (node?: Node) => {
    const createMdxContent = await new Promise<BlockStatement | null>(resolve => {
        if (!node) {
            resolve(null);
        }

        traverse(node, {
            FunctionDeclaration(path) {
                const { node } = path;
                if (node?.id.name !== "_createMdxContent") {
                    return;
                }

                this.stop();
                resolve(node.body);
            },
        });

        resolve(null);
    });

    const mdxContent = await new Promise<BlockStatement | null>(resolve => {
        if (!node) {
            resolve(null);
        }

        traverse(node, {
            FunctionDeclaration(path) {
                const { node } = path;
                if (node?.id.name !== "MDXContent") {
                    return;
                }

                this.stop();
                resolve(node.body);
            },
        });

        resolve(null);
    });

    let expression: boolean;
    let body: Literal | BlockStatement;
    if (!createMdxContent || !mdxContent) {
        expression = true;
        body = builders.literal(null);
    } else {
        expression = false;
        body = builders.blockStatement([
            builders.variableDeclaration("const", [
                builders.variableDeclarator(
                    builders.identifier("_createMdxContent"),
                    builders.arrowFunctionExpression(
                        [builders.identifier("props")],
                        createMdxContent,
                        true,
                    ),
                ),
            ]),
            builders.returnStatement(
                builders.arrowFunctionExpression(
                    [
                        builders.assignmentPattern(
                            builders.identifier("props"),
                            builders.objectExpression([]),
                        ),
                    ],
                    mdxContent,
                    true,
                ),
            ),
        ]);
    }

    return builders.exportNamedDeclaration(
        builders.variableDeclaration("const", [
            builders.variableDeclarator(
                builders.identifier("Summary"),
                builders.arrowFunctionExpression([], body, expression),
            ),
        ]),
    );
};

// 处理 metadata 中的 summary，转换为 jsx 组件后作为 Summary 导出
export const recmaSummary = (): Transformer<Program> => async (tree, file, next) => {
    const summary = await findSummaryPropertyValue(tree);

    let Summary = await generateSummaryExport();
    // 如果 summary 属性非空，则将其转换
    if (summary && !R.isEmpty(summary.trim())) {
        // 将 summary 编译为 estree
        const tree = jsToTree(await mdxCompile(file, summary));
        Summary = await generateSummaryExport(tree);
    }

    tree.body.push(Summary);

    next(undefined, tree);
};
