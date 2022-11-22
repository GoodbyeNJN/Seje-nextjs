import path from "path";

export const getAppRootPath = () => process.env.APP_ROOT_PATH;

export const getClientPath = () => path.resolve(getAppRootPath(), "apps/client");

export const getServerPath = () => path.resolve(getAppRootPath(), "apps/server");

export const getBlogPath = () => path.resolve(getAppRootPath(), "blog");
