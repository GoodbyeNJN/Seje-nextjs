import createBundleAnalyzer from "@next/bundle-analyzer";

import { getValuesFromProcessEnv } from "server/utils/env";

import type { NextConfig } from "next";

const { isProd, useBundleAnalyzer } = getValuesFromProcessEnv();

export const withBundleAnalyzer = async (configOrPromise: MaybePromise<NextConfig>) => {
    const nextConfig = await configOrPromise;

    const wrapper = createBundleAnalyzer({
        enabled: isProd && useBundleAnalyzer,
    });

    return wrapper(nextConfig);
};
