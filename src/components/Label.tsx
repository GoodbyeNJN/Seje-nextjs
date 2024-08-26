import { Link } from "./Link";

import type { Category, Tag } from "data";

export interface LabelProps {
    current?: Category | Tag;
    list: (Category | Tag)[];
    isCategory?: boolean;
    isTag?: boolean;
}

export const Label: React.FC<LabelProps> = props => {
    const { current, list, isTag } = props;

    return (
        <ul className="flex flex-wrap gap-2 p-0">
            {list.map(({ slug, permalink }) => (
                <Link key={slug} href={permalink} className="no-underline">
                    <li
                        className={cx(
                            "list-none rounded-3xl border border-seje-border px-2 py-1.5 text-xs leading-none hover:bg-seje-border",
                            { "bg-seje-border": slug === current?.slug },
                        )}
                    >
                        {isTag ? `# ${slug}` : slug}
                    </li>
                </Link>
            ))}
        </ul>
    );
};
