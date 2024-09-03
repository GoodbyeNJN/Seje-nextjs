import variablePlugin from "@mertasan/tailwindcss-variables";
import colorVariable from "@mertasan/tailwindcss-variables/colorVariable";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",

    content: ["src/**/*.tsx"],

    theme: {
        variables: {
            DEFAULT: {
                colors: {
                    seje: {
                        body: "#fff",
                        text: "#000",
                        comment: "#818181",
                        link: "#616161",
                        border: "#ddd",
                        scrollbar: "#616161",
                    },
                    shiki: {
                        fg: "#383a42", // editor.foreground
                        bg: "#fafafa", // editor.background
                        highlight: "#e5e5e6", // editor.selectionBackground
                        error: "#e51400", // editorError.foreground
                        warning: "#bf8803", // editorWarning.foreground
                        insert: "#00809b", // diffEditor.insertedTextBackground
                        remove: "#ff0000", // diffEditor.removedTextBackground
                    },
                },
            },
        },
        darkVariables: {
            DEFAULT: {
                colors: {
                    seje: {
                        body: "#2f2f2f",
                        text: "#fff",
                        link: "#e5e5e5",
                        border: "#616161",
                        scrollbar: "#ddd",
                    },
                    shiki: {
                        fg: "#abb2bf", // editor.foreground
                        bg: "#282c34", // editor.background
                        highlight: "#3e4451", // editor.selectionBackground
                        error: "#f14c4c", // editorError.foreground
                        warning: "#cca700", // editorWarning.foreground
                        insert: "#00809b", // diffEditor.insertedTextBackground
                        remove: "#ff0000", // diffEditor.removedTextBackground
                    },
                },
            },
        },

        colors: {
            seje: {
                body: colorVariable("--colors-seje-body", true),
                text: colorVariable("--colors-seje-text", true),
                comment: colorVariable("--colors-seje-comment", true),
                link: colorVariable("--colors-seje-link", true),
                border: colorVariable("--colors-seje-border", true),
                scrollbar: colorVariable("--colors-seje-scrollbar", true),

                100: "#fff",
                400: "#ddd",
                500: "#818181",
                600: "#616161",
                800: "#2f2f2f",
                900: "#000",
            },

            shiki: {
                fg: colorVariable("--colors-shiki-fg", true),
                bg: colorVariable("--colors-shiki-bg", true),
                highlight: colorVariable("--colors-shiki-highlight", true),
                error: colorVariable("--colors-shiki-error", true),
                warning: colorVariable("--colors-shiki-warning", true),
                insert: colorVariable("--colors-shiki-insert", true),
                remove: colorVariable("--colors-shiki-remove", true),
            },
        },

        fontFamily: {
            serif: [
                "Source Han Serif TC",
                "Source Han Serif SC",
                "Source Han Serif",
                "Noto Serif CJK TC",
                "Noto Serif CJK SC",
                "Noto Serif CJK",
                "Noto Serif TC",
                "Noto Serif SC",
                "Noto Serif",
                "serif",
            ],
            mono: ["monospace"],
        },

        extend: {
            minHeight: {
                half: "50%",
            },

            minWidth: {
                half: "50%",
            },
        },
    },

    plugins: [
        variablePlugin({
            colorVariables: true,
            forceRGB: true,
        }),
    ],
};
