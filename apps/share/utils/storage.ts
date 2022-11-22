import { isServerEnvironment } from "./common";
import { isUndefined } from "./type";

export interface Storage {
    getItem: <T = string>(key: string) => T | null;
    setItem: <T = string>(key: string, value: T) => void;
    removeItem: (key: string) => void;
    clear: () => void;
}

const getStorage = (adaptor: globalThis.Storage | null): Storage => ({
    getItem: <T = string>(key: string) => {
        let value: T | null = null;

        try {
            const item = adaptor?.getItem(key);
            value = isUndefined(item) ? null : (item as T | null);
        } catch {}

        return value;
    },

    setItem: <T = string>(key: string, value: T) => {
        try {
            adaptor?.setItem(key, value as string);
        } catch {}
    },

    removeItem: (key: string) => {
        try {
            adaptor?.removeItem(key);
        } catch {}
    },

    clear: () => {
        try {
            adaptor?.clear();
        } catch {}
    },
});

export const localStorage = getStorage(isServerEnvironment() ? null : window.localStorage);

export const sessionStorage = getStorage(isServerEnvironment() ? null : window.sessionStorage);
