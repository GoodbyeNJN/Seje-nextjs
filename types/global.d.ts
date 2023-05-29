import type ReactTypes from "react";

type SetRequired<BaseType, Keys extends keyof BaseType> = BaseType &
    Omit<BaseType, Keys> &
    Required<Pick<BaseType, Keys>>;

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_PATH: string;
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

    interface WindowEventMap extends globalThis.WindowEventMap {
        themechange: CustomEvent<Theme>;
    }

    type React = ReactTypes;

    class ObjectConstructor {
        entries<T = Record<string, unknown>>(o: T): [keyof T, T[keyof T]][];

        fromEntries<T = any>(entries: [keyof T, T[keyof T]][]): T;

        /**
         * Determines whether an object has a property with the specified name.
         * @param o An object.
         * @param v A property name.
         */
        hasOwn<T, K extends keyof T>(o: T, v: K): o is SetRequired<T, K>;
        hasOwn<K extends PropertyKey>(o: object, v: K): o is { [K in K]: unknown };
    }
}

export {};
