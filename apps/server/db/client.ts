import dayjs from "dayjs";
import _, { remove } from "lodash";

interface PageQuery {
    pageNumber: number;
    pageSize: number;
}

const merge = <T>(target: T[], source: T[], key = "id") =>
    _.values(_.merge(_.keyBy(target, key), _.keyBy(source, key)));

const query = <T>(collection: T[], query?: PageQuery) => {
    if (!query) {
        return collection;
    }

    const { pageNumber, pageSize } = query;
    const start = (pageNumber - 1) * pageSize;
    const end = pageNumber * pageSize;

    return collection.slice(start, end);
};

class Data {
    public constructor(protected db: Db.LowDb<Db.Data>) {}

    public get pages() {
        return this.db.data.pages;
    }

    public set pages(value) {
        this.db.data.pages = value;
    }

    public get posts() {
        return this.db.data.posts;
    }

    public set posts(value) {
        this.db.data.posts = value;
    }

    public get categories() {
        return this.db.data.categories;
    }

    public set categories(value) {
        this.db.data.categories = value;
    }

    public get tags() {
        return this.db.data.tags;
    }

    public set tags(value) {
        this.db.data.tags = value;
    }

    public get postsCategoriesMap() {
        return this.db.data.postsCategoriesMap;
    }

    public set postsCategoriesMap(value) {
        this.db.data.postsCategoriesMap = value;
    }

    public get postsTagsMap() {
        return this.db.data.postsTagsMap;
    }

    public set postsTagsMap(value) {
        this.db.data.postsTagsMap = value;
    }

    public get caches() {
        return this.db.data.caches;
    }

    public set caches(value) {
        this.db.data.caches = value;
    }

    public async reload() {
        await this.db.read();
        this.db.data ||= {
            pages: [],
            posts: [],
            categories: [],
            tags: [],
            postsCategoriesMap: {},
            postsTagsMap: {},
            caches: [],
        };
    }

    public async save() {
        await this.db.write();
    }
}

export class Client extends Data {
    public async merge(data: Partial<Db.Data>) {
        const { pages, posts, categories, tags, postsCategoriesMap, postsTagsMap, caches } = data;

        if (pages) {
            const merged = _.orderBy(merge(this.pages, pages), "slug");
            _.merge(this.db.data, { pages: merged });
        }
        if (posts) {
            const merged = _.orderBy(
                merge(this.posts, posts),
                post => dayjs(post.date).valueOf(),
                "desc",
            );
            _.merge(this.db.data, { posts: merged });
        }
        if (categories) {
            const merged = _.orderBy(merge(this.categories, categories), "slug");
            _.merge(this.db.data, { categories: merged });
        }
        if (tags) {
            const merged = _.orderBy(merge(this.tags, tags), "slug");
            _.merge(this.db.data, { tags: merged });
        }

        if (postsCategoriesMap) {
            const merged = _.chain(this.postsCategoriesMap)
                .assign(postsCategoriesMap)
                .toPairs()
                .orderBy()
                .filter(([, value]) => Boolean(value.length))
                .fromPairs()
                .value();
            _.merge(this.db.data, { postsCategoriesMap: merged });
        }
        if (postsTagsMap) {
            const merged = _.chain(this.postsTagsMap)
                .assign(postsTagsMap)
                .toPairs()
                .orderBy()
                .filter(([, value]) => Boolean(value.length))
                .fromPairs()
                .value();
            _.merge(this.db.data, { postsTagsMap: merged });
        }

        if (caches) {
            const merged = merge(this.caches, caches, "path");
            _.merge(this.db.data, { caches: merged });
        }

        await this.save();
    }

    public async getPageById(id: string) {
        return _.find(this.pages, { id });
    }

    public async getPageLinks() {
        return _.map(this.pages, "link");
    }

    public async getPageByLink(link: string) {
        return _.find(this.pages, { link });
    }

    public async deletePageById(id: string) {
        const pages = _.remove(this.pages, { id });
        await this.save();
        return pages;
    }

    public async getPosts(params?: PageQuery) {
        return query(this.posts, params);
    }

    public async getPostById(id: string) {
        return _.find(this.posts, { id });
    }

    public async getPostsByCategoryId(id: string) {
        const postIds = this.postsCategoriesMap[id] || [];
        return _.chain(this.posts).keyBy("id").at(postIds).value();
    }

    public async getPostsByTagId(id: string) {
        const postIds = this.postsTagsMap[id] || [];
        return _.chain(this.posts).keyBy("id").at(postIds).value();
    }

    public async getPostLinks() {
        return _.map(this.posts, "link");
    }

    public async getPostByLink(link: string) {
        return _.find(this.posts, { link });
    }

    public async deletePostById(id: string) {
        const posts = _.remove(this.posts, { id });
        await this.save();
        return posts;
    }

    public async getCategories(params?: PageQuery) {
        return query(this.categories, params);
    }

    public async getCategoryById(id: string) {
        return _.find(this.categories, { id });
    }

    public async getCategoriesByPostId(id: string) {
        const categoryIds = this.postsCategoriesMap[id] || [];
        return _.chain(this.categories).keyBy("id").at(categoryIds).value();
    }

    public async getCategoryLinks() {
        return _.map(this.categories, "link");
    }

    public async getCategoryByLink(link: string) {
        return _.find(this.categories, { link });
    }

    public async getTags(params?: PageQuery) {
        return query(this.tags, params);
    }

    public async getTagById(id: string) {
        return _.find(this.tags, { id });
    }

    public async getTagsByPostId(id: string) {
        const tagIds = this.postsTagsMap[id] || [];
        return _.chain(this.tags).keyBy("id").at(tagIds).value();
    }

    public async getTagLinks() {
        return _.map(this.tags, "link");
    }

    public async getTagByLink(link: string) {
        return _.find(this.tags, { link });
    }

    public async getCacheByPath(path: string) {
        return _.find(this.caches, { path });
    }

    public async deleteCacheByPath(path: string) {
        const caches = _.remove(this.caches, { path });
        await this.save();
        return caches;
    }
}
