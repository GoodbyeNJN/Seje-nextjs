const path = require("path");
const BundleAnalyzer = require("@next/bundle-analyzer");
const AutoImport = require("unplugin-auto-import/webpack");

const withBundleAnalyzer = BundleAnalyzer({
    enabled: process.env.NODE_ENV === "production" && JSON.parse(process.env.ANALYZE),
});

/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    basePath: process.env.BASE_PATH,

    images: {
        unoptimized: true,
    },

    webpack: config => {
        config.resolve.alias["rehype-parse"] = path.resolve(
            __dirname,
            "node_modules",
            "rehype-dom-parse",
        );

        config.plugins.push(
            AutoImport({
                dts: "./typings/auto-imports.d.ts",

                imports: ["react", { clsx: [["default", "cx"]] }],
            }),
        );

        return config;
    },

    experimental: {
        externalDir: true,
    },
};

module.exports = withBundleAnalyzer(nextConfig);
