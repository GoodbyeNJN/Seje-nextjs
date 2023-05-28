import { isBoolean, isFunction, isUndefined } from "@/utils/type";

export const useBoolean = (initialState: boolean) => {
    const [value, setValue] = useState(initialState);

    const toggle = useCallback((value?: boolean | ((prevState: boolean) => unknown)) => {
        if (isFunction(value)) {
            setValue(prev => {
                const next = value(prev);
                return isBoolean(next) ? next : !prev;
            });
        } else if (isUndefined(value)) {
            setValue(prev => !prev);
        } else {
            setValue(Boolean(value));
        }
    }, []);

    return [value, toggle] as const;
};
