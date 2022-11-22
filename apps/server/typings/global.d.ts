import type { Literal } from "hast";

declare global {}

declare module "hast" {
    export interface Code extends Literal {
        type: "code";
        lang: string | null;
    }

    export interface Html extends Literal {
        type: "html";
    }

    interface RootContentMap {
        code: Code;
        html: Html;
    }
}

export {};
