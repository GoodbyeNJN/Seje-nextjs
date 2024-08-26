declare module "recma-import-images" {
    import type { Program } from "estree-jsx";
    import type { Transformer } from "unified";

    export function recmaImportImages(): Transformer<Program>;
}
