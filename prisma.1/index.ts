import { isProdEnv } from "@/utils/env";

import { init } from "./init";

export type * from "./types";

const globalForPrisma = global as unknown as {
    db: ReturnType<typeof init>;
};

export const db = globalForPrisma.db || init();

if (!isProdEnv) {
    globalForPrisma.db = db;
}
