export const isServerEnv = typeof window === "undefined";

export const isDevEnv = process.env.NODE_ENV === "development";
export const isProdEnv = process.env.NODE_ENV === "production";
