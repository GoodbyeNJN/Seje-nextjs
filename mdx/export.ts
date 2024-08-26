import { valueToEstree } from "estree-util-value-to-estree";
import { parse as parseYaml } from "yaml";

import { EXIT, getPermalink, mdToText, visitAsync } from "./utils";

import type { Node, Root, Yaml } from "mdast";
import type { Transformer } from "unified";

const isYamlNode = (node: Node): node is Yaml => node.type === "yaml";

interface Frontmatter {
    type?: "post" | "page" | null;
    title?: string | null;
    created?: string | null;
    updated?: string | null;
    categories?: (string | null)[] | null;
    tags?: (string | null)[] | null;
    summary?: string | null;
}

const parseFrontmatter = (frontmatter: Frontmatter) => {
    const type = frontmatter.type || "post";
    const title = frontmatter.title || "";
    const created = frontmatter.created || "1970-01-01";
    const updated = frontmatter.updated || "1970-01-01";
    const categories = R.filter(frontmatter.categories || [], R.isTruthy);
    const tags = R.filter(frontmatter.tags || [], R.isTruthy);
    const summary = frontmatter.summary || "";

    return { type, title, created, updated, categories, tags, summary };
};

export const remarkExport = (): Transformer<Root> => async (tree, file, next) => {
    await visitAsync(
        tree,
        isYamlNode,
        async node => {
            const frontmatter = parseFrontmatter(parseYaml(node.value));
            const permalink = getPermalink(file.path);
            const description = await mdToText(frontmatter.summary);
            const keywords = frontmatter.tags;

            const metadata = { ...frontmatter, permalink, description, keywords };

            tree.children.unshift({
                type: "mdxjsEsm",
                value: "",
                data: {
                    estree: {
                        type: "Program",
                        sourceType: "module",
                        body: [
                            {
                                type: "ExportNamedDeclaration",
                                specifiers: [],
                                declaration: {
                                    type: "VariableDeclaration",
                                    kind: "const",
                                    declarations: [
                                        {
                                            type: "VariableDeclarator",
                                            id: { type: "Identifier", name: "metadata" },
                                            init: valueToEstree(metadata),
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            });
        },
        EXIT,
    );

    next(undefined, tree);
};
