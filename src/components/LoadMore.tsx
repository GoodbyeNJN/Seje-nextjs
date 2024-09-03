"use client";

import { isDefined } from "remeda";
import { blogConfig } from "virtual-blog-config";

import { useBoolean } from "client/hooks/useBoolean";
import { getRemoteSummaryByPagination } from "server/api/components";

import { PostList } from "./PostList";

import type { MdxPage, Metadata } from "server/types";

export interface LoadMoreProps {
    metadata: Metadata[][];
}

const getPageNum = () => {
    const url = new URL(window.location.href);
    const page = url.searchParams.get("page") || "1";

    return parseInt(page, 10);
};

const setPageNum = (page?: number) => {
    const url = new URL(window.location.href);

    if (isDefined(page)) {
        url.searchParams.set("page", page.toString());
    } else {
        url.searchParams.delete("page");
    }

    window.history.replaceState(null, "", url.toString());
};

// 加载更多按钮
export const LoadMore: React.FC<LoadMoreProps> = props => {
    const { metadata } = props;
    const { showLoadMore } = blogConfig.home;

    const [status, setStatus] = useState<"loading" | "success" | "error">("success");
    const [list, setList] = useState<MdxPage[]>([]);
    const [hasMore, toggleHasMore] = useBoolean(true);

    const onClick = async () => {
        if (status !== "success") return;

        const next = getPageNum() + 1;

        try {
            setStatus("loading");

            const { list, hasMore } = await getRemoteSummaryByPagination(metadata, next);
            setList(prev => prev.concat(list));
            toggleHasMore(hasMore);
            setPageNum(next);

            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");

            window.setTimeout(() => {
                setStatus("success");
            }, 1500);
        }
    };

    useEffect(() => {
        setPageNum();
    }, []);

    return (
        <>
            {list.length > 0 && <hr />}

            <PostList list={list} />

            {showLoadMore && hasMore && (
                <>
                    <hr />
                    <section className="flex justify-center text-seje-link">
                        <button onClick={onClick} className="cursor-pointer underline">
                            {status === "loading"
                                ? "加载中..."
                                : status === "error"
                                  ? "加载失败"
                                  : "旧文"}
                        </button>
                    </section>
                </>
            )}
        </>
    );
};
