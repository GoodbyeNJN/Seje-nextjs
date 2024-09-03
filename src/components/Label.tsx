import { LinkNoUnderline } from "./Link";

import type { Category, Tag } from "server/types";

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
            {list.map(({ title, permalink }) => (
                <LinkNoUnderline key={permalink} href={permalink}>
                    <li
                        className={cx(
                            "list-none rounded-3xl border border-seje-border px-2 py-1.5 text-xs leading-none hover:bg-seje-border",
                            { "bg-seje-border": permalink === current?.permalink },
                        )}
                    >
                        {isTag ? `# ${title}` : title}
                    </li>
                </LinkNoUnderline>
            ))}
        </ul>
    );
};
