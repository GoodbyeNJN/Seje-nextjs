import dayjs from "dayjs";
import _ from "lodash";

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

export class Client {
    public constructor(private db: Db.LowDb<Db.Db>) {}

    public get pages() {
        return this.db.data?.pages || [];
    }

    public get posts() {
        return this.db.data?.posts || [];
    }

    public get categories() {
        return this.db.data?.categories || [];
    }

    public get tags() {
        return this.db.data?.tags || [];
    }

    public get postsCategoriesMap() {
        return this.db.data?.postsCategoriesMap || {};
    }

    public get postsTagsMap() {
        return this.db.data?.postsTagsMap || {};
    }

    public get caches() {
        return this.db.data?.caches || [];
    }

    public async reload() {
        await this.db.read();
    }

    public async save() {
        await this.db.write();
    }

    public async merge(data: Partial<Db.Db>) {
        await this.reload();

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

    public async getPosts(params?: PageQuery) {
        await this.reload();

        return query(this.posts, params);
    }

    public async getCategories(params?: PageQuery) {
        await this.reload();

        return query(this.categories, params);
    }

    public async getTags(params?: PageQuery) {
        await this.reload();

        return query(this.tags, params);
    }

    public async getPostById(id: string) {
        await this.reload();

        return _.find(this.posts, { id });
    }

    public async getCategoryById(id: string) {
        await this.reload();

        return _.find(this.categories, { id });
    }

    public async getTagById(id: string) {
        await this.reload();

        return _.find(this.tags, { id });
    }

    public async getPostsByCategoryId(id: string) {
        await this.reload();

        const postIds = this.postsCategoriesMap[id] || [];
        return _.chain(this.posts).keyBy("id").at(postIds).value();
    }

    public async getPostsByTagId(id: string) {
        await this.reload();

        const postIds = this.postsTagsMap[id] || [];
        return _.chain(this.posts).keyBy("id").at(postIds).value();
    }

    public async getCategoriesByPostId(id: string) {
        await this.reload();

        const categoryIds = this.postsCategoriesMap[id] || [];
        return _.chain(this.categories).keyBy("id").at(categoryIds).value();
    }

    public async getTagsByPostId(id: string) {
        await this.reload();

        const tagIds = this.postsTagsMap[id] || [];
        return _.chain(this.tags).keyBy("id").at(tagIds).value();
    }

    public async getPostLinks() {
        await this.reload();

        return _.map(this.posts, "link");
    }

    public async getPostByLink(link: string) {
        await this.reload();

        return _.find(this.posts, { link });
    }

    public async getCategoryLinks() {
        await this.reload();

        return _.map(this.categories, "link");
    }

    public async getCategoryByLink(link: string) {
        await this.reload();

        return _.find(this.categories, { link });
    }

    public async getTagLinks() {
        await this.reload();

        return _.map(this.tags, "link");
    }

    public async getTagByLink(link: string) {
        await this.reload();

        return _.find(this.tags, { link });
    }

    public async getPageLinks() {
        await this.reload();

        return _.map(this.pages, "link");
    }

    public async getPageByLink(link: string) {
        await this.reload();

        return _.find(this.pages, { link });
    }
}
