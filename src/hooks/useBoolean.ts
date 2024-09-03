import { isBoolean, isDefined } from "remeda";

export const useBoolean = (initialState: boolean) => {
    const [value, setValue] = useState(initialState);

    const toggle = useCallback((value?: boolean | ((prevState: boolean) => unknown)) => {
        if (!isDefined(value)) {
            setValue(prev => !prev);
        } else if (isBoolean(value)) {
            setValue(value);
        } else {
            setValue(prev => {
                const next = value(prev);
                return isBoolean(next) ? next : !prev;
            });
        }
    }, []);

    return [value, toggle] as const;
};
