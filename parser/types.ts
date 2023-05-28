export interface BaseFile {
    filePath: string;
    fileHash: string;
    contentHash: string;
    content: string;
}

export interface RawFile extends BaseFile {
    data: Record<string, unknown>;
    excerpt?: string;
}

export interface PostFile extends BaseFile {
    title: string;
    slug: string;
    date: string;
    categories: string[];
    tags: string[];
    excerpt?: string;
}

export interface PageFile extends BaseFile {
    title: string;
    slug: string;
}
