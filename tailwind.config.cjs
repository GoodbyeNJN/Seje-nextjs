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
