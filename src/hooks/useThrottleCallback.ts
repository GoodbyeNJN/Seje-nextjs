import { throttle } from "utils/throttle";

import { useUnmount } from "./useUnmount";

import type { ThrottledFn, ThrottleOptions } from "utils/throttle";

type Fn = (...args: any[]) => any;

export const useThrottleCallback = <T extends Fn>(fn: T, wait = 0, options?: ThrottleOptions) => {
    const throttled = useMemo(() => throttle(fn, wait, options), [fn, wait, options]);
    const throttledRef = useRef<ThrottledFn<T>>();

    // Update the debounced function ref whenever func, wait, or options change
    useEffect(() => {
        throttledRef.current = throttle(fn, wait, options);
    }, [fn, wait, options]);

    useUnmount(() => {
        throttledRef.current?.cancel();
    });

    return throttled;
};
