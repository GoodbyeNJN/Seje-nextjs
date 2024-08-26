import { parseUnknownError } from "@/utils/error";

import type { Reducer } from "react";

interface State<T> {
    isLoading: boolean;
    data?: T | null;
    error?: Error | null;
}

type Action<T> =
    | { type: "loading" }
    | { type: "success"; payload: T | null }
    | { type: "error"; payload: Error | null };

export interface FetchOptions<T> extends RequestInit {
    onSuccess?: (data: T) => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
    deserialize?: (text: string) => T;
}

export const useFetch = <T = unknown>(url: string, options?: FetchOptions<T>) => {
    const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(
        (state, action): State<T> => {
            switch (action.type) {
                case "loading":
                    return { isLoading: true };
                case "success":
                    return { isLoading: false, data: action.payload };
                case "error":
                    return { isLoading: false, error: action.payload };
                default:
                    return state;
            }
        },
        { isLoading: false },
    );

    const fetch = useCallback(async () => {
        dispatch({ type: "loading" });

        const { onSuccess, onError, deserialize, ...rest } = options || {};

        try {
            const response = await window.fetch(url, rest);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = (
                deserialize ? deserialize(await response.text()) : await response.json()
            ) as T;
            await onSuccess?.(data);

            dispatch({ type: "success", payload: data });
        } catch (error) {
            const e = parseUnknownError(error);
            await onError?.(e);

            dispatch({ type: "error", payload: e });
        }
    }, [url, options]);

    const resetData = useCallback(() => {
        dispatch({ type: "success", payload: null });
    }, []);

    const resetError = useCallback(() => {
        dispatch({ type: "error", payload: null });
    }, []);

    return { ...state, fetch, resetData, resetError };
};
