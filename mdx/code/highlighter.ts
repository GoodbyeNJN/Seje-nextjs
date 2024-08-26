import { bundledLanguages, bundledThemes, getHighlighter as getShikijiHighlighter } from "shikiji";

let highlighter: Awaited<ReturnType<typeof getShikijiHighlighter>>;

export const initHighlighter = async () => {
    if (!highlighter) {
        highlighter = await getShikijiHighlighter({
            themes: Object.keys(bundledThemes),
            langs: Object.keys(bundledLanguages),
        });
    }

    return highlighter;
};

export const codeToHast = (...params: Parameters<typeof highlighter.codeToHast>) =>
    highlighter.codeToHast(...params);

export const loadTheme = (...params: Parameters<typeof highlighter.loadTheme>) =>
    highlighter.loadTheme(...params);

export const getLoadedThemeNames = (...params: Parameters<typeof highlighter.getLoadedThemes>) =>
    highlighter.getLoadedThemes(...params);

export const getLoadedTheme = (...params: Parameters<typeof highlighter.getTheme>) =>
    highlighter.getTheme(...params);
