import VirtualModulesPlugin from "webpack-virtual-modules";

import {
    defaultBlogConfig,
    defaultGoogleApis,
    defaultGStatic,
    defaultNavbar,
} from "server/blog/default-config";
import { getBlogConfig } from "server/blog/validate";
import { createDebugger } from "utils/debug";

import type { NextConfig } from "next";
import type { BlogConfig } from "server/blog/schema";
import type { Compiler, Configuration } from "webpack";

const debug = createDebugger("[blog-config-loader]");

const VIRTUAL_MODULE_ID = "virtual-blog-config";

class BlogConfigLoaderPlugin {
    constructor(private blogConfig: BlogConfig) {}

    apply(compiler: Compiler) {
        const virtualModules = new VirtualModulesPlugin();
        virtualModules.apply(compiler);

        compiler.hooks.compilation.tap("BlogConfigLoaderPlugin", () => {
            virtualModules.writeModule(
                VIRTUAL_MODULE_ID,
                `
export const defaultNavbar = ${JSON.stringify(defaultNavbar, null, 2)};
export const defaultGoogleApis = ${JSON.stringify(defaultGoogleApis, null, 2)};
export const defaultGStatic = ${JSON.stringify(defaultGStatic, null, 2)};
export const defaultBlogConfig = ${JSON.stringify(defaultBlogConfig, null, 2)};
export const blogConfig = ${JSON.stringify(this.blogConfig, null, 2)};
`.trim(),
            );
        });
    }
}

export const withBlogConfigLoader = async (configOrPromise: MaybePromise<NextConfig>) => {
    debug.start("Main");

    const nextConfig = await configOrPromise;

    const blogConfig = getBlogConfig(false);

    const url = new URL(blogConfig.url);
    nextConfig.basePath = url.pathname === "/" ? "" : url.pathname;

    const wrapped: NextConfig = {
        ...nextConfig,
        webpack: (config: Configuration, ctx) => {
            config.plugins ||= [];
            config.plugins.push(new BlogConfigLoaderPlugin(blogConfig));

            return nextConfig.webpack?.(config, ctx) || config;
        },
    };

    debug.end("Main");

    return wrapped;
};
