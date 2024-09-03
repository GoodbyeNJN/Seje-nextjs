import { isNonNullish } from "remeda";

type Fn = (...args: any[]) => any;

interface WrappedFn<T extends Fn> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}

interface Options {
    leading?: boolean;
    trailing?: boolean;
}

export type DebouncedFn<T extends Fn> = WrappedFn<T>;
export type ThrottledFn<T extends Fn> = WrappedFn<T>;

export type DebounceOptions = Options;
export type ThrottleOptions = Options;

const wrap = <T extends Fn>(fn: T, wait: number, options: Required<Options>): WrappedFn<T> => {
    const { leading, trailing } = options;

    let timerId: ReturnType<typeof globalThis.setTimeout> | undefined;

    const wrapped: WrappedFn<T> = (...args) => {
        if (isNonNullish(timerId)) return;

        // 启动定时器
        timerId = globalThis.setTimeout(() => {
            timerId = undefined;

            trailing && fn(...args);
        }, wait);

        leading && fn(...args);
    };

    wrapped.cancel = () => {
        if (isNonNullish(timerId)) {
            globalThis.clearTimeout(timerId);
        }

        timerId = undefined;
    };

    return wrapped;
};

export const debounce = <T extends Fn>(fn: T, wait = 0, options: Options = {}) => {
    const { leading = false, trailing = true } = options;

    return wrap(fn, wait, { leading, trailing });
};

export const throttle = <T extends Fn>(fn: T, wait = 0, options: Options = {}) => {
    const { leading = true, trailing = true } = options;

    return wrap(fn, wait, { leading, trailing });
};
