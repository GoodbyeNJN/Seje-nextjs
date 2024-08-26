import fs from "node:fs";
import path from "node:path";

import { getProjectPath } from "@/utils/path";

import { treeToJs } from "./utils";

import type { Program } from "estree-jsx";
import type { Transformer } from "unified";

const dirpath = `${getProjectPath()}/mdx-debug`;
if (!fs.existsSync(dirpath)) {
    await fs.promises.mkdir(dirpath);
}

// 将最终转换后的 jsx 保存到文件中，用作调试
export const recmaDebug = (): Transformer<Program> => (tree, file) => {
    const { name } = path.parse(
        /page\.mdx?$/.test(file.path) ? path.dirname(file.path) : file.path,
    );
    fs.writeFileSync(path.resolve(dirpath, `${name}.jsx`), treeToJs(tree));
};
