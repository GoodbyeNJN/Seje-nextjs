import { useEventListener } from "./useEventListener";

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>("light");

    const toggle = useCallback((theme?: Theme) => {
        const nextTheme = window.getTheme?.() === "light" ? "dark" : "light";
        window.setTheme?.(theme || nextTheme);
    }, []);

    const onThemeChange = useCallback((event: CustomEvent<Theme>) => setTheme(event.detail), []);

    useEventListener("themechange", onThemeChange);

    useEffect(() => {
        setTheme(window.getTheme?.() || "light");
    }, []);

    return { theme, toggle };
};
