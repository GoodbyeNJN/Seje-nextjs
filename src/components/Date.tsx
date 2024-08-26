import { blogConfig } from "@/config";
import { getChineseDate } from "@/utils/date";

export interface DateProps {
    created: string;
    updated: string;
    noYear?: boolean;
    className?: string;
}

export const Date: React.FC<DateProps> = props => {
    const { created, updated: _updated, noYear, className } = props;
    const { showCreatedOrUpdated, showDetailTooltip } = blogConfig.date;

    // 如果更新时间是默认值，那么就用创建时间代替
    const updated = _updated === "1970-01-01" ? created : _updated;
    // 如果更新时间是默认值，那么就不显示更新于
    const title = `创建于：${created}` + (_updated === "1970-01-01" ? "" : `\n更新于：${updated}`);

    const { year, month, day } = getChineseDate(
        showCreatedOrUpdated === "created" ? created : updated,
    );

    return (
        <p title={showDetailTooltip ? title : undefined} className={className}>
            {(noYear ? "" : `${year}年`) + `${month}月${day}日`}
        </p>
    );
};
