const isType = (value: unknown, type: string) =>
    Object.prototype.toString.call(value) === `[object ${type}]`;

export const isNull = (value: unknown): value is null => isType(value, "Null");

export const isUndefined = (value: unknown): value is undefined => isType(value, "Undefined");

export const isString = (value: unknown): value is string => isType(value, "String");

export const isNumber = (value: unknown): value is number => isType(value, "Number");

export const isBoolean = (value: unknown): value is boolean => isType(value, "Boolean");

export const isSymbol = (value: unknown): value is symbol => isType(value, "Symbol");

export const isBigInt = (value: unknown): value is bigint => isType(value, "BigInt");

export const isFunction = (value: unknown): value is Function => isType(value, "Function");

export const isObject = (value: unknown): value is object => isType(value, "Object");

export const isArray = (value: unknown): value is unknown[] => isType(value, "Array");

export const isDate = (value: unknown): value is Date => isType(value, "Date");

export const isRegExp = (value: unknown): value is RegExp => isType(value, "RegExp");

export const isPromise = (value: unknown): value is Promise<unknown> => isType(value, "Promise");

export const isMap = (value: unknown): value is Map<unknown, unknown> => isType(value, "Map");

export const isSet = (value: unknown): value is Set<unknown> => isType(value, "Set");

export const isWeakMap = (value: unknown): value is WeakMap<object, unknown> =>
    isType(value, "WeakMap");

export const isWeakSet = (value: unknown): value is WeakSet<object> => isType(value, "WeakSet");

export const isNullOrUndefined = (value: unknown): value is null | undefined =>
    isNull(value) || isUndefined(value);
