import _ from "lodash";

export interface Diff<T> {
    create: T[];
    update: T[];
    remove: T[];
}

export const diff = <T>(a: T[], b: T[]): Diff<T> => {
    const create = _.difference(a, b);
    const update = _.intersection(a, b);
    const remove = _.difference(b, a);

    return { create, update, remove };
};
