import { isPlainObject, isString } from "remeda";

export interface ErrorLike extends Partial<Error> {
    message: string;
}

const isErrorLike = (error: unknown): error is ErrorLike =>
    isPlainObject(error) && Object.hasOwn(error, "message") && isString(error.message);

export const parseUnknownError = (error: unknown) => {
    if (isErrorLike(error)) {
        return error as Error;
    }

    try {
        return new Error(JSON.stringify(error));
    } catch {
        return new Error(String(error));
    }
};

export const parseValueToBoolean = (value: unknown, defaultValue: boolean) => {
    const str = String(value).trim().toLowerCase();

    if (/^(?:y|yes|true|1|on)$/.test(str)) return true;
    if (/^(?:n|no|false|0|off)$/.test(str)) return false;

    return defaultValue;
};
