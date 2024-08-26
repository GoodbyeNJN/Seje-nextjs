import createBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import Unimport from "unimport/unplugin";
import webpack from "webpack";

import { getBasePath } from ".";
import { mdxOptions } from "../mdx";

import type { NextConfig } from "next";

const command = process.argv[2] || "dev";
const isProd = command !== "dev";
const isDev = command === "dev";
const isBundleAnalyze = R.isTruthy(process.env.ANALYZE);

const nextConfig: NextConfig = {
    output: "export",
    basePath: getBasePath() === "/" ? "" : getBasePath(),
    pageExtensions: ["mdx", "md", "tsx", "ts", "jsx", "js"],

    images: {
        unoptimized: true,
    },

    eslint: {
        ignoreDuringBuilds: true,
    },

    typescript: {
        ignoreBuildErrors: true,
    },

    webpack: config => {
        config.plugins.push(
            Unimport.webpack({
                dts: "./types/auto-imports.d.ts",

                presets: ["react"],

                imports: [
                    { name: "default", as: "cx", from: "clsx" },
                    { name: "*", as: "R", from: "remeda" },
                ],
            }),
        );

        config.plugins.push(
            new webpack.DefinePlugin({
                "import.meta.env.DEV": isDev,
                "import.meta.env.PROD": isProd,
                "import.meta.env.SSR": `typeof window === "undefined"`,
            }),
        );

        config.infrastructureLogging = {
            level: "error",
        };

        return config;
    },
};

const withMDX = createMDX(mdxOptions);

const withBundleAnalyzer = createBundleAnalyzer({
    enabled: isProd && isBundleAnalyze,
});

export default withBundleAnalyzer(withMDX(nextConfig));
