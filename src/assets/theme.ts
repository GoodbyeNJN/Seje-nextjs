const themeKey = "theme";
const themes = ["light", "dark"] as const;
const classList = document.documentElement.classList;
const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
const storage = sessionStorage;

const setClassTheme = (theme: Theme) => {
    classList.remove(...themes);
    classList.add(theme);

    return window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
};

const getNextTheme = (preferDarkTheme: boolean) => {
    let userTheme;
    try {
        userTheme = storage.getItem(themeKey);
    } catch {}

    return (userTheme || (preferDarkTheme ? themes[1] : themes[0])) as Theme;
};

setClassTheme(getNextTheme(mediaQuery.matches));

mediaQuery.addEventListener("change", event => setClassTheme(getNextTheme(event.matches)));

window.getTheme = () =>
    Array.from(classList).find(className => themes.includes(className as Theme)) as Theme;

window.setTheme = (theme: Theme) => {
    try {
        storage.setItem(themeKey, theme);
    } catch {}

    setClassTheme(theme);
};
