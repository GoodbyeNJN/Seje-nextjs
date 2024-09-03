import UnimportPlugin from "unimport/unplugin";

import type { NextConfig } from "next";
import type { Configuration } from "webpack";

export const withAutoImport = async (configOrPromise: MaybePromise<NextConfig>) => {
    const nextConfig = await configOrPromise;

    const wrapped: NextConfig = {
        ...nextConfig,
        webpack: (config: Configuration, ctx) => {
            config.plugins ||= [];
            config.plugins.push(
                UnimportPlugin.webpack({
                    dts: "./types/auto-imports.d.ts",

                    presets: ["react"],

                    imports: [{ name: "default", as: "cx", from: "clsx" }],
                }),
            );

            return nextConfig.webpack?.(config, ctx) || config;
        },
    };

    return wrapped;
};
