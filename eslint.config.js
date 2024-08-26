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
    }),
];
