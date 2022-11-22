declare global {
    type Theme = "light" | "dark";

    interface Window {
        getTheme: () => Theme;
        setTheme: (theme: Theme) => void;
    }

    interface DocumentEventMap extends globalThis.DocumentEventMap {
        themechange: CustomEvent<Theme>;
    }
}

export {};
