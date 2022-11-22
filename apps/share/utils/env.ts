import { isUndefined } from "./type";

export const isServerEnvironment = () => {
    try {
        return isUndefined(window);
    } catch {
        return true;
    }
};
