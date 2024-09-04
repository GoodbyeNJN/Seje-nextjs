import { blogConfig } from "virtual-blog-config";

import { fromISODateString, getChineseDate } from "utils/date";

export interface DateProps extends React.PropsWithClassName {
    created: string;
    updated: string;
    noYear?: boolean;
}

export const Date: React.FC<DateProps> = props => {
    const { created, updated: _updated, noYear, className } = props;
    const { timezone, showCreatedOrUpdated, showDetailTooltip } = blogConfig.date;

    // 如果更新时间是默认值，那么就用创建时间代替
    const updated = _updated === "1970-01-01" ? created : _updated;
    // 如果更新时间是默认值，那么就不显示更新于
    const title = `创建于：${created}` + (_updated === "1970-01-01" ? "" : `\n更新于：${updated}`);

    const { year, month, day } = getChineseDate(
        fromISODateString(showCreatedOrUpdated === "created" ? created : updated, timezone),
    );

    return (
        <p title={showDetailTooltip ? title : undefined} className={className}>
            {(noYear ? "" : `${year}年`) + `${month}月${day}日`}
        </p>
    );
};
