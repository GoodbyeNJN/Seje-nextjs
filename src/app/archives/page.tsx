import { Date, Link } from "components";
import { getPostsGroupByCreatedYear, getPostsGroupByUpdatedYear } from "data";

import { blogConfig, getPageTitles } from "@/config";
import { getChineseDate } from "@/utils/date";

const title = getPageTitles().archives;

const Page = async () => {
    const { showCreatedOrUpdated } = blogConfig.date;
    const getter =
        showCreatedOrUpdated === "created"
            ? getPostsGroupByCreatedYear
            : getPostsGroupByUpdatedYear;
    const list = await getter();

    return (
        <section>
            <ul>
                {list.map(([year, posts]) => (
                    <li
                        key={year}
                        className="border-t border-seje-border py-4 first:border-t-0 first:pt-0 last:pb-0"
                    >
                        <h2>{getChineseDate(year).year}</h2>

                        <ul className="mt-4 space-y-1">
                            {posts.map(({ title, created, updated, permalink }) => (
                                <li key={permalink} className="flex flex-wrap justify-between">
                                    <Link href={permalink}>{title}</Link>

                                    <Date
                                        created={created}
                                        updated={updated}
                                        noYear
                                        className="ml-auto"
                                    />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export const metadata = {
    title,
};

export default Page;
