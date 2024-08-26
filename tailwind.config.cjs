const colorVariable = require("@mertasan/tailwindcss-variables/colorVariable");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",

    content: ["./**/*.tsx", "./**/*.ts"],

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
                },
            },

            "pre.shiki": {
                colors: {
                    shiki: {
                        fg: "var(--light-fg, --fg)",
                        bg: "var(--light-bg, --bg)",
                        "title-fg": "var(--light-title-fg, --title-fg)",
                        "title-bg": "var(--light-title-bg, --title-bg)",
                        "index-fg": "var(--light-index-fg, --index-fg)",
                        "insert-bg": "var(--light-insert-bg, --insert-bg)",
                        "remove-bg": "var(--light-remove-bg, --remove-bg)",
                        "highlight-fg": "var(--light-highlight-fg, --highlight-fg)",
                        "highlight-bg": "var(--light-highlight-bg, --highlight-bg)",
                    },
                },
            },

            "code.shiki": {
                colors: {
                    shiki: {
                        fg: "var(--light-fg, --fg)",
                        bg: "var(--light-bg, --bg)",
                    },
                },
            },

            "pre.shiki span, code.shiki span": {
                colors: {
                    shiki: {
                        fg: "var(--light-fg, --fg)",
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
                },
            },

            "pre.shiki": {
                colors: {
                    shiki: {
                        fg: "var(--dark-fg, --fg)",
                        bg: "var(--dark-bg, --bg)",
                        "title-fg": "var(--dark-title-fg, --title-fg)",
                        "title-bg": "var(--dark-title-bg, --title-bg)",
                        "index-fg": "var(--dark-index-fg, --index-fg)",
                        "insert-bg": "var(--dark-insert-bg, --insert-bg)",
                        "remove-bg": "var(--dark-remove-bg, --remove-bg)",
                        "highlight-fg": "var(--dark-highlight-fg, --highlight-fg)",
                        "highlight-bg": "var(--dark-highlight-bg, --highlight-bg)",
                    },
                },
            },

            "code.shiki": {
                colors: {
                    shiki: {
                        fg: "var(--dark-fg, --fg)",
                        bg: "var(--dark-bg, --bg)",
                    },
                },
            },

            "pre.shiki span, code.shiki span": {
                colors: {
                    shiki: {
                        fg: "var(--dark-fg, --fg)",
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
                fg: "var(--colors-shiki-fg)",
                bg: "var(--colors-shiki-bg)",
                "title-fg": "var(--colors-shiki-title-fg)",
                "title-bg": "var(--colors-shiki-title-bg)",
                "index-fg": "var(--colors-shiki-index-fg)",
                "insert-bg": "var(--colors-shiki-insert-bg)",
                "remove-bg": "var(--colors-shiki-remove-bg)",
                "highlight-fg": "var(--colors-shiki-highlight-fg)",
                "highlight-bg": "var(--colors-shiki-highlight-bg)",
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
        require("@mertasan/tailwindcss-variables")({
            colorVariables: true,
            forceRGB: true,
        }),
    ],
};
