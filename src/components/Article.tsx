export interface ArticleProps {
    permalink: string;
    title: React.ReactNode;
    content: React.ReactNode;
    addition: React.ReactNode;
    className?: string;
}

export const Article: React.FC<ArticleProps> = props => {
    const { permalink, title, content, addition } = props;

    return (
        <article
            data-permalink={permalink}
            className="flex flex-1 flex-col gap-4 border-t border-seje-border py-4 text-justify first:border-t-0 first:pt-0 last:border-b-0 last:pb-0"
        >
            {title && <section className="space-y-4">{title}</section>}

            <section className="flex-1 space-y-4">{content}</section>

            {addition && (
                <section className="flex flex-wrap items-center justify-between gap-2">
                    {addition}
                </section>
            )}
        </article>
    );
};
