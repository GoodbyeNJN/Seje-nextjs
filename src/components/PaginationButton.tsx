import { Link } from "./Link";

export interface PrevPageButtonProps {
    page: number;
    hasPrev: boolean;
}

export interface NextPageButtonProps {
    page: number;
    hasNext: boolean;
}

// 上一页按钮
export const PrevPageButton: React.FC<PrevPageButtonProps> = props => {
    const { page, hasPrev } = props;

    if (!hasPrev) {
        return null;
    }

    return (
        <section className="flex justify-center border-b border-seje-border pb-6 text-seje-link">
            <Link href={page === 2 ? "/" : `/home/page/${page - 1}`}>新文</Link>
        </section>
    );
};

// 下一页按钮
export const NextPageButton: React.FC<NextPageButtonProps> = props => {
    const { page, hasNext } = props;

    if (!hasNext) {
        return null;
    }

    return (
        <section className="flex justify-center border-t border-seje-border pt-6 text-seje-link">
            <Link href={`/home/page/${page + 1}`}>旧文</Link>
        </section>
    );
};
