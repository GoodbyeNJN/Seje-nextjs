import dayjs from "dayjs";

import type { Db } from "@/prisma";
import { getChineseDate, getChineseMonth, getChineseYear } from "@/utils/date";

import { Content } from "./content";
import { Label } from "./label";
import { Link } from "./link";

export interface PostProps {
    isTitleLink?: boolean;
    showExcerpt?: boolean;
    showReadMore?: boolean;
    showCategories?: boolean;
    showTags?: boolean;
    post: Db.Post;
    categories?: Db.Category[];
    tags?: Db.Tag[];
}

export interface PostListProps {
    list: Db.Post[];
}

const groupByYear = (posts: Db.Post[]) => {
    const map = new Map<string, Db.Post[]>();
    posts.forEach(post => {
        const year = post.year.toString();
        const posts = map.get(year);
        const value = posts ? posts.concat(post) : [post];
        map.set(year, value);
    });

    return Array.from(map);
};

export const Post: React.FC<PostProps> = props => {
    const {
        isTitleLink,
        showExcerpt,
        showReadMore,
        showCategories,
        showTags,
        post,
        categories,
        tags,
    } = props;
    const { title, date, permalink, excerpt, content } = post;

    return (
        <article className="border-seje-border flex flex-1 flex-col gap-4 border-t py-4 text-justify first:border-t-0 first:pt-0 last:pb-0">
            <section>
                {isTitleLink ? (
                    <h1 className="text-center">
                        <Link href={permalink} className="text-seje-text no-underline">
                            {title}
                        </Link>
                    </h1>
                ) : (
                    <h1 className="text-center">{title}</h1>
                )}
            </section>

            <section className="flex-1 space-y-4">
                <Content content={showExcerpt ? excerpt : content} />
            </section>

            <section className="flex items-end justify-between">
                <time dateTime={dayjs(date).toISOString()} className="block">
                    {getChineseYear(date)}年{getChineseMonth(date)}月{getChineseDate(date)}日
                </time>

                {showExcerpt && showReadMore && (
                    <Link href={permalink} className="text-sm">
                        查看全文
                    </Link>
                )}

                {(showCategories || showTags) && (
                    <div className="flex gap-2">
                        {showCategories && categories && <Label list={categories} isCategory />}

                        {showTags && tags && <Label list={tags} isTag />}
                    </div>
                )}
            </section>
        </article>
    );
};

export const PostList: React.FC<PostListProps> = props => {
    const { list } = props;

    return (
        <ul>
            {groupByYear(list).map(([year, posts]) => (
                <li
                    key={year}
                    className="border-seje-border border-t py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                    <h2>{getChineseYear(year)}</h2>

                    <ul className="mt-4 space-y-1">
                        {posts.map(({ id, title, link, date }) => (
                            <li key={id} className="flex justify-between">
                                <Link href={link}>{title}</Link>

                                <p>
                                    {getChineseMonth(date)}月{getChineseDate(date)}日
                                </p>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};
