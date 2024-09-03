import { withGoodbyeNJNConfig } from "eslint-config-goodbyenjn";

export default [
    ...withGoodbyeNJNConfig({
        react: {
            overrides: {
                "react-hooks/exhaustive-deps": [
                    "warn",
                    { additionalHooks: "(useSafeLayoutEffect)" },
                ],
            },
        },
        typescript: {
            overrides: {
                "@typescript-eslint/no-invalid-void-type": "off",
            },
        },
    }),
];
