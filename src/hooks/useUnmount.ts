export const useUnmount = (fn: () => void) => {
    const ref = useRef(fn);

    ref.current = fn;

    useEffect(
        () => () => {
            ref.current();
        },
        [],
    );
};
