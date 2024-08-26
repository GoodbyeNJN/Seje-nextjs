import { blogConfig } from "@/config";

import { Article } from "./Article";
import { Date } from "./Date";
import { Link } from "./Link";

import type { PostInfo } from "data";

export interface PostListProps {
    list: PostInfo[];
}

export const PostList: React.FC<PostListProps> = props => {
    const { list } = props;
    const { showSummary, showReadMore } = blogConfig.home;

    return list.map(({ title, created, updated, permalink, Summary, Page }) => (
        <Article
            key={permalink}
            permalink={permalink}
            title={
                <h1>
                    <Link href={permalink} className="text-seje-text no-underline">
                        {title}
                    </Link>
                </h1>
            }
            content={showSummary ? <Summary /> : <Page />}
            addition={
                <>
                    <Date created={created} updated={updated} />

                    {showSummary && showReadMore && (
                        <Link href={permalink} className="ml-auto text-sm">
                            查看全文
                        </Link>
                    )}
                </>
            }
        />
    ));
};
