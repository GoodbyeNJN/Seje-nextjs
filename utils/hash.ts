import crypto from "node:crypto";

/** 计算 hash */
export const getHash = (str: string, length = 16) =>
    crypto.createHash("shake256", { outputLength: length }).update(str).digest("hex");
