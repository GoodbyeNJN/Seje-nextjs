import { Fragment } from "react";
import { blogConfig } from "virtual-blog-config";

import { Date } from "client/components/Date";
import { groupPostMetadataByYear } from "server/api/metadata";
import { fromISODateString, getChineseDate } from "utils/date";

import { LinkNoUnderline } from "./Link";

import type { Metadata } from "server/types";

export interface GroupPostListProps {
    list: Metadata[];
}

export const GroupPostList: React.FC<GroupPostListProps> = props => {
    const { timezone, showCreatedOrUpdated } = blogConfig.date;

    const { list } = props;

    const grouped = groupPostMetadataByYear(list, showCreatedOrUpdated);

    return (
        <ul className="flex flex-col gap-4">
            {grouped.map(([year, metadata], index) => (
                <Fragment key={year}>
                    <li>
                        <h2>{getChineseDate(fromISODateString(year, timezone)).year}</h2>

                        <ul className="mt-4 space-y-1">
                            {metadata.map(({ title, created, updated, permalink }) => (
                                <li key={permalink} className="flex flex-wrap justify-between">
                                    <LinkNoUnderline href={permalink}>{title}</LinkNoUnderline>

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

                    {index < grouped.length - 1 && <hr />}
                </Fragment>
            ))}
        </ul>
    );
};
