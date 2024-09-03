import { builders } from "estree-toolkit";

import { createDebugger } from "utils/debug";

import type { Program, Statement } from "estree-jsx";
import type { Transformer } from "unified";

const debug = createDebugger("[recma-wrap-function]");

const wrapFunctionBody = async (tree: Program) => {
    const wrapper = builders.exportDefaultDeclaration(
        builders.functionDeclaration(
            builders.identifier("Module"),
            [],
            builders.blockStatement(tree.body as Statement[]),
            false,
            false,
        ),
    );

    tree.body = [wrapper];
};

export const recmaToModule = (): Transformer<Program> => async (tree, file, next) => {
    // debug.start("Main");

    await wrapFunctionBody(tree);

    // debug.end("Main");

    next(undefined, tree, file);
};
