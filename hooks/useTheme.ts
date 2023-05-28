export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>("light");

    const toggle = useCallback((theme?: Theme) => {
        const nextTheme = window.getTheme?.() === "light" ? "dark" : "light";
        window.setTheme?.(theme || nextTheme);
    }, []);

    useEffect(() => {
        setTheme(window.getTheme?.() || "light");
        const onThemeChange = (event: CustomEvent<Theme>) => setTheme(event.detail);

        document.addEventListener("themechange", onThemeChange);

        return () => {
            document.removeEventListener("themechange", onThemeChange);
        };
    }, []);

    return { theme, toggle };
};
