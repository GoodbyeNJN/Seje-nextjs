import path from "path";

import { getServerPath } from "share/utils";

class Client {
    private db: Db.LowSyncDb<Db.Blog>;

    public constructor(db: Db.LowSyncDb<Db.Blog>) {
        this.db = db;
    }

    public init(data: Db.Blog) {
        this.db.data = data;
        this.db.write();
    }

    public reload() {
        this.db.read();
    }

    public get pages() {
        this.reload();
        return this.db.data.pages;
    }

    public get posts() {
        this.reload();
        return this.db.data.posts;
    }

    public get categories() {
        this.reload();
        return this.db.data.categories;
    }

    public get tags() {
        this.reload();
        return this.db.data.tags;
    }

    public get postsCategoriesMap() {
        this.reload();
        return this.db.data.postsCategoriesMap;
    }

    public get postsTagsMap() {
        this.reload();
        return this.db.data.postsTagsMap;
    }

    public getPostById(id: string) {
        return this.posts.find(post => post.id === id);
    }

    public getCategoryById(id: string) {
        return this.categories.find(category => category.id === id);
    }

    public getTagById(id: string) {
        return this.tags.find(tag => tag.id === id);
    }

    public getPostsByCategoryId(id: string) {
        return this.posts.filter(post => this.postsCategoriesMap[post.id]?.includes(id));
    }

    public getPostsByTagId(id: string) {
        return this.posts.filter(post => this.postsTagsMap[post.id]?.includes(id));
    }

    public getCategoriesByPostId(id: string) {
        return this.categories.filter(category =>
            this.postsCategoriesMap[id]?.includes(category.id),
        );
    }

    public getTagsByPostId(id: string) {
        return this.tags.filter(tag => this.postsTagsMap[id]?.includes(tag.id));
    }
}

const getDbFilePath = () => path.resolve(getServerPath(), "db/db.json");

let client: Client | null = null;
export const getClient = async () => {
    if (client) {
        return client;
    }

    const { LowSync, JSONFileSync } = await import("lowdb");
    const adapter = new JSONFileSync<Db.Blog>(getDbFilePath());
    const db = new LowSync(adapter) as unknown as Db.LowSyncDb<Db.Blog>;

    client = new Client(db);

    return client;
};
