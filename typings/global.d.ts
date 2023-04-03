declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_ROOT_PATH: string;
            BASE_PATH: string;
            SITE_URL: string;
            ANALYZE_MODE: boolean;
            WATCH_MODE: boolean;
        }
    }

    class ObjectConstructor {
        public entries<T = Record<string, unknown>>(o: T): [keyof T, T[keyof T]][];

        public fromEntries<T = any>(entries: [keyof T, T[keyof T]][]): T;
    }
}

export {};
