export interface ErrorLike extends Partial<Error> {
    message: string;
}

export const isErrorLike = (error: unknown): error is ErrorLike =>
    R.isPlainObject(error) && Object.hasOwn(error, "message") && R.isString(error.message);

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
