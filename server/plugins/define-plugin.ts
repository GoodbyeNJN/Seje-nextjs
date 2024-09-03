import webpack from "webpack";

import { getValuesFromProcessEnv } from "server/utils/env";

import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const { isDev, isProd } = getValuesFromProcessEnv();

export const withDefinePlugin = async (configOrPromise: MaybePromise<NextConfig>) => {
    const nextConfig = await configOrPromise;

    const wrapped: NextConfig = {
        ...nextConfig,
        webpack: (config: Configuration, ctx) => {
            config.plugins ||= [];
            config.plugins.push(
                new webpack.DefinePlugin({
                    "import.meta.env.DEV": isDev,
                    "import.meta.env.PROD": isProd,
                    "import.meta.env.SSR": `typeof window === "undefined"`,
                    "import.meta.env.BASE_URL": JSON.stringify(nextConfig.basePath),
                }),
            );

            return nextConfig.webpack?.(config, ctx) || config;
        },
    };

    return wrapped;
};
