import { pipe } from "remeda";
import { tsImport } from "tsx/esm/api";

const require = id => tsImport(id, import.meta.filename);

const { withAssetFileLoader } = await require("./server/plugins/asset-file-loader");
const { withAutoImport } = await require("./server/plugins/auto-import");
const { withBlogConfigLoader } = await require("./server/plugins/blog-config-loader");
const { withBundleAnalyzer } = await require("./server/plugins/bundle-analyzer");
const { withDefinePlugin } = await require("./server/plugins/define-plugin");
const { withMdxFileLoader } = await require("./server/plugins/mdx-file-loader");
const { createDebugger } = await require("./utils/debug");

const debug = createDebugger("[next-config]");

const nextConfig = {
    output: "export",
    basePath: "",

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
        config.infrastructureLogging = {
            level: "error",
        };

        return config;
    },
};

debug.start("Load plugins");

const withPlugins = await pipe(
    nextConfig,
    withBlogConfigLoader,
    withAutoImport,
    withDefinePlugin,
    withAssetFileLoader,
    withMdxFileLoader,
    withBundleAnalyzer,
);

debug.end("Load plugins");

export default withPlugins;
