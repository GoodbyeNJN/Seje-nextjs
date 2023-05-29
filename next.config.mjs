import BundleAnalyzer from "@next/bundle-analyzer";
import Unimport from "unimport/unplugin";

/** @type {import("next").NextConfig} */
const nextConfig = {
    swcMinify: true,
    output: "export",
    basePath: process.env.BASE_PATH === "/" ? "" : process.env.BASE_PATH,

    images: { unoptimized: true },

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

                imports: [{ name: "default", as: "cx", from: "clsx" }],
            }),
        );

        config.infrastructureLogging = {
            level: "error",
        };

        return config;
    },
};

const withBundleAnalyzer = BundleAnalyzer({
    enabled: process.env.NODE_ENV === "production" && JSON.parse(process.env.BUNDLE_ANALYZE),
});

export default withBundleAnalyzer(nextConfig);
