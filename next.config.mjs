import BundleAnalyzer from "@next/bundle-analyzer";
import Unimport from "unimport/unplugin";
import webpack from "webpack";

const isProdEnv = process.env.NODE_ENV === "production";
const basePath = process.env.BASE_PATH === "/" ? "" : process.env.BASE_PATH;

/** @type {import('next').NextConfig} */
const config = {
    swcMinify: true,
    output: "export",
    basePath,

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

                imports: [
                    { name: "*", as: "React", from: "react" },
                    { name: "default", as: "cx", from: "clsx" },
                ],
            }),
        );

        if (process.platform !== "darwin") {
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /^fsevents$/,
                }),
            );
        }

        config.infrastructureLogging = {
            level: "error",
        };

        return config;
    },
};

const withBundleAnalyzer = BundleAnalyzer({
    enabled: isProdEnv && JSON.parse(process.env.BUNDLE_ANALYZE),
});

export default withBundleAnalyzer(config);
