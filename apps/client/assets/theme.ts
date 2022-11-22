// @ts-ignore
{
    let themeKey = "theme";
    let themes = ["light", "dark"] as const;
    let classList = document.documentElement.classList;
    let mediaQuery = matchMedia("(prefers-color-scheme: dark)");
    let storage = sessionStorage;

    let setClassTheme = (theme: Theme) => {
        classList.remove(...themes);
        classList.add(theme);

        return document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
    };

    let getNextTheme = (preferDarkTheme: boolean) => {
        let userTheme: string | null;
        try {
            userTheme = storage.getItem(themeKey);
        } catch {}

        // @ts-expect-error TS2454
        return (userTheme as Theme) || (preferDarkTheme ? themes[1] : themes[0]);
    };

    setClassTheme(getNextTheme(mediaQuery.matches));

    mediaQuery.addEventListener("change", event => {
        let next = getNextTheme(event.matches);
        return setClassTheme(next);
    });

    window.getTheme = () =>
        Array.from(classList).find(className => themes.includes(className as Theme)) as Theme;

    window.setTheme = (theme: Theme) => {
        try {
            storage.setItem(themeKey, theme);
        } catch {}

        setClassTheme(theme);
    };
}
