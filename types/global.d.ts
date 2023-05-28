declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BLOG_PATH: string;
            BASE_PATH: string;
            BUNDLE_ANALYZE: string;
            SKIP_CONFIG_VALIDATION: string;
        }
    }

    type Theme = "light" | "dark";

    interface Window {
        getTheme: () => Theme;
        setTheme: (theme: Theme) => void;
    }

    interface DocumentEventMap extends globalThis.DocumentEventMap {
        themechange: CustomEvent<Theme>;
    }

    class ObjectConstructor {
        public entries<T = Record<string, unknown>>(o: T): [keyof T, T[keyof T]][];

        public fromEntries<T = any>(entries: [keyof T, T[keyof T]][]): T;
    }
}

export {};
