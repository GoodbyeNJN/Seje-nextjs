module.exports = {
    extends: ["goodbyenjn"],
    rules: {
        "react-hooks/exhaustive-deps": ["warn", { additionalHooks: "(useSafeLayoutEffect)" }],
    },
};
