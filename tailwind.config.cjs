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

                        "header-footer": "#818181",

                        border: "#ddd",
                        "border-reverse": "#616161",

                        link: "#616161",
                        "link-reverse": "#e5e5e5",
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

                        border: "#616161",
                        "border-reverse": "#ddd",

                        link: "#e5e5e5",
                        "link-reverse": "#616161",
                    },
                },
            },
        },

        colors: {
            seje: {
                body: colorVariable("--colors-seje-body", true),

                "header-footer": colorVariable("--colors-seje-header-footer", true),

                text: colorVariable("--colors-seje-text", true),

                border: colorVariable("--colors-seje-border", true),
                "border-reverse": colorVariable("--colors-seje-border-reverse", true),

                link: colorVariable("--colors-seje-link", true),
                "link-reverse": colorVariable("--colors-seje-link-reverse", true),

                100: "#fff",
                400: "#ddd",
                500: "#818181",
                600: "#616161",
                800: "#2f2f2f",
                900: "#000",
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
            mono: ["Ubuntu Mono", "monospace"],
        },

        // fontFamily: {
        //     serif: ["var(--noto-serif-tc)", "var(--noto-serif-sc)"],
        //     mono: ["var(--ubuntu-mono)"],
        // },

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
