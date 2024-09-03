export interface ArticleProps extends React.PropsWithClassName {
    title: React.ReactNode;
    content: React.ReactNode;
    addition: React.ReactNode;
    before?: React.ReactNode;
    after?: React.ReactNode;
}

export const Article: React.FC<ArticleProps> = props => {
    const { title, content, addition, before, after } = props;

    return (
        <>
            {before}

            <article className="flex flex-1 flex-col gap-4 text-justify first:border-t-0 first:pt-0 last:border-b-0 last:pb-0">
                {title && <section className="space-y-4">{title}</section>}

                <section className="flex-1 space-y-4">{content}</section>

                {addition && (
                    <section className="flex flex-wrap items-center justify-between gap-2">
                        {addition}
                    </section>
                )}
            </article>

            {after}
        </>
    );
};
