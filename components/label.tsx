import type { Db } from "@/prisma";

import { Link } from "./link";

export interface LabelProps {
    current?: Db.Category | Db.Tag;
    list: (Db.Category | Db.Tag)[];
    isCategory?: boolean;
    isTag?: boolean;
}

export const Label: React.FC<LabelProps> = props => {
    const { current, list, isTag } = props;

    return (
        <ul className="flex flex-wrap gap-2 p-0">
            {list.map(({ id, slug, permalink }) => (
                <Link key={id} href={permalink} className="no-underline">
                    <li
                        className={cx(
                            "border-seje-border hover:bg-seje-border list-none rounded-3xl border px-2.5 py-2 text-xs leading-3",
                            { "bg-seje-border": id === current?.id },
                        )}
                    >
                        {isTag ? `# ${slug}` : slug}
                    </li>
                </Link>
            ))}
        </ul>
    );
};
