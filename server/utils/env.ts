import { parseValueToBoolean } from "utils/parse";

export const getValuesFromProcessEnv = () => {
    const command = process.argv[2] || "dev";
    const isDev = command === "dev";
    const isProd = command !== "dev";

    const isWorkerThread = parseValueToBoolean(process.env.NEXT_PRIVATE_WORKER, false);

    const isDeployPreview = parseValueToBoolean(process.env.DEPLOY_PREVIEW, false);
    const useBundleAnalyzer = parseValueToBoolean(process.env.USE_BUNDLE_ANALYZER, false);

    return { isDev, isProd, isWorkerThread, isDeployPreview, useBundleAnalyzer };
};
