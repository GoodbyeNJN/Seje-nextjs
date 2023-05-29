import dayjs from "dayjs";

import type { CategoryOrTag, PostMarkdown } from "@/parser";
import { getChineseDate, getChineseMonth, getChineseYear } from "@/utils/date";

import { Label } from "./label";
import { Link } from "./link";

export interface PostProps {
    isTitleLink?: boolean;
    showExcerpt?: boolean;
    showReadMore?: boolean;
    showCategories?: boolean;
    showTags?: boolean;
    content: React.ReactNode;
    post: PostMarkdown;
    categories?: CategoryOrTag[];
    tags?: CategoryOrTag[];
}

export interface PostListProps {
    list: PostMarkdown[];
}

const groupByYear = (posts: PostMarkdown[]) => {
    const map = new Map<string, PostMarkdown[]>();
    posts.forEach(post => {
        const year = post.created.year().toString();
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
        content,
        post,
        categories,
        tags,
    } = props;
    const { title, created, permalink } = post;

    return (
        <article className="flex flex-1 flex-col gap-4 border-t border-seje-border py-4 text-justify first:border-t-0 first:pt-0 last:pb-0">
            <section>
                {isTitleLink ? (
                    <h1>
                        <Link href={permalink} className="text-seje-text no-underline">
                            {title}
                        </Link>
                    </h1>
                ) : (
                    <h1>{title}</h1>
                )}
            </section>

            <section className="flex-1 space-y-4">{content}</section>

            <section className="flex flex-wrap items-center justify-between gap-2">
                <p className="leading-normal">
                    {getChineseYear(created)}年{getChineseMonth(created)}月{getChineseDate(created)}
                    日
                </p>

                {showExcerpt && showReadMore && (
                    <Link href={permalink} className="ml-auto text-sm">
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
                    className="border-t border-seje-border py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                    <h2>{getChineseYear(dayjs(year))}</h2>

                    <ul className="mt-4 space-y-1">
                        {posts.map(({ title, created, permalink }) => (
                            <li key={permalink} className="flex flex-wrap justify-between">
                                <Link href={permalink}>{title}</Link>

                                <p className="ml-auto">
                                    {getChineseMonth(created)}月{getChineseDate(created)}日
                                </p>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};
