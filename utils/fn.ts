type Fn = (...args: any[]) => any;

export interface DebouncedFn<T extends Fn> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}

export interface DebounceOptions {
    leading?: boolean;
    trailing?: boolean;
}

export const debounce = <T extends Fn>(fn: T, wait = 0, options: DebounceOptions = {}) => {
    const { leading = false, trailing = true } = options;

    let timerId: ReturnType<typeof globalThis.setTimeout> | undefined;

    const debounced: DebouncedFn<T> = (...args) => {
        if (R.isDefined(timerId)) return;

        // 启动定时器
        timerId = globalThis.setTimeout(() => {
            timerId = undefined;

            trailing && fn(...args);
        }, wait);

        leading && fn(...args);
    };

    debounced.cancel = () => {
        if (R.isDefined(timerId)) {
            globalThis.clearTimeout(timerId);
        }

        timerId = undefined;
    };

    return debounced;
};

export const throttle = <T extends Fn>(fn: T, wait = 0, options: DebounceOptions = {}) => {
    const { leading = true, trailing = true } = options;

    return debounce(fn, wait, { leading, trailing });
};
