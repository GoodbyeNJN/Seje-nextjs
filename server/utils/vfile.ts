import path from "node:path";

import { clone } from "remeda";

export type Data = Record<string, unknown>;

export interface Options<T extends Data = Data> {
    pathname: string;
    value: string;
    cwd?: string;
    data?: T;
}

export class VFile<T extends Data = Data> {
    value = "";
    data: T;

    #cwd = "";
    #dirname = "";
    #filename = "";
    #extname = "";

    constructor(options: Options<T>) {
        const { pathname, value, cwd = process.cwd(), data = {} as unknown as T } = options;

        this.value = value;
        this.#cwd = cwd;
        this.data = data;

        this.parse(pathname);
    }

    get cwd() {
        return this.#cwd;
    }

    set cwd(value: string) {
        this.#cwd = value;
    }

    get dirname() {
        return this.#dirname;
    }

    set dirname(value) {
        this.#dirname = value;
    }

    get filename() {
        return this.#filename;
    }

    set filename(value) {
        this.#filename = value;
    }

    get extname() {
        return this.#extname;
    }

    set extname(value) {
        this.#extname = value;
    }

    get pathname() {
        return path.resolve(this.#cwd, this.#dirname, this.basename);
    }

    set pathname(value) {
        this.parse(value);
    }

    get basename() {
        return this.#filename + this.#extname;
    }

    set basename(value) {
        const { name, ext } = path.parse(value);
        this.#filename = name;
        this.#extname = ext;
    }

    get absoluteDirname() {
        return path.resolve(this.#cwd, this.#dirname);
    }

    set absoluteDirname(value) {
        this.#dirname = path.relative(this.#cwd, value);
    }

    get relativePathname() {
        return path.relative(this.#cwd, this.pathname);
    }

    set relativePathname(value) {
        this.parse(path.resolve(this.#cwd, value));
    }

    clone() {
        const vfile = new VFile({
            pathname: this.pathname,
            value: this.value,
            cwd: this.#cwd,
            data: clone(this.data),
        });

        return vfile;
    }

    private parse(value: string) {
        this.#dirname = path.relative(this.#cwd, path.dirname(value));
        this.#extname = path.extname(value);
        this.#filename = path.basename(value, this.#extname);
    }
}
