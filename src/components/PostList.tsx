import { blogConfig } from "virtual-blog-config";

import { Article } from "./Article";
import { Date } from "./Date";
import { Link, LinkNoUnderline } from "./Link";

import type { MdxPage } from "server/types";

export interface PostListProps {
    list: MdxPage[];
}

export const PostList: React.FC<PostListProps> = props => {
    const { list } = props;
    const { showSummary, showReadMore } = blogConfig.home;

    return list.map(({ metadata: { permalink, title, created, updated }, Component }, index) => (
        <Article
            key={permalink}
            title={
                <h1>
                    <LinkNoUnderline href={permalink} className="text-seje-text">
                        {title}
                    </LinkNoUnderline>
                </h1>
            }
            content={<Component />}
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
            before={index !== 0 && <hr />}
        />
    ));
};
