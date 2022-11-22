import { parseCotent } from "client/parser";
import { getChineseDate } from "share/utils";

import { Label } from "./label";
import { Link } from "./link";

export interface ArticleProps {
    isTitleLink?: boolean;
    showExcerpt?: boolean;
    showReadMore?: boolean;
    showCategories?: boolean;
    showTags?: boolean;
    post: Db.Post;
    categories?: Db.Category[];
    tags?: Db.Tag[];
}

export interface ArticleListProps {
    map: [string, Db.Post[]][];
}

const parseDate = (date: string) =>
    getChineseDate(date, {
        year: { show: true, suffix: "年" },
        month: { show: true, suffix: "月" },
        date: { show: true, suffix: "日" },
    });

const parseYear = (date: string) =>
    getChineseDate(date, {
        year: { show: true },
    });

const parseMonthDate = (date: string) =>
    getChineseDate(date, {
        month: { show: true, suffix: "月" },
        date: { show: true, suffix: "日" },
    });

export const Article: React.FC<ArticleProps> = props => {
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
    const { title, date, link, excerpt, content } = post;

    return (
        <article className="border-seje-border flex flex-1 flex-col gap-4 border-t py-4 text-justify first:border-t-0 first:pt-0 last:pb-0">
            <section>
                {isTitleLink ? (
                    <h1 className="text-center">
                        <Link href={link} className="text-seje-text no-underline">
                            {title}
                        </Link>
                    </h1>
                ) : (
                    <h1 className="text-center">{title}</h1>
                )}
            </section>

            <section className="flex-1 space-y-4">
                {parseCotent(showExcerpt ? excerpt : content)}
            </section>

            <section className="flex items-end justify-between">
                <time dateTime={date} className="block">
                    {parseDate(date)}
                </time>

                {showExcerpt && showReadMore && (
                    <Link href={link} className="text-sm">
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

export const ArticleList: React.FC<ArticleListProps> = props => {
    const { map } = props;

    return (
        <ul>
            {map.map(([year, posts]) => (
                <li
                    key={year}
                    className="border-seje-border border-t py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                    <h2>{parseYear(year)}</h2>

                    <ul className="mt-4 space-y-1">
                        {posts.map(post => (
                            <li key={post.id} className="flex justify-between">
                                <Link href={post.link}>{post.title}</Link>

                                <p>{parseMonthDate(post.date)}</p>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};
