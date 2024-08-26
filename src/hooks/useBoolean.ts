export const useBoolean = (initialState: boolean) => {
    const [value, setValue] = useState(initialState);

    const toggle = useCallback((value?: boolean | ((prevState: boolean) => unknown)) => {
        if (R.isNullish(value)) {
            setValue(prev => !prev);
        } else if (R.isBoolean(value)) {
            setValue(value);
        } else {
            setValue(prev => {
                const next = value(prev);
                return R.isBoolean(next) ? next : !prev;
            });
        }
    }, []);

    return [value, toggle] as const;
};
