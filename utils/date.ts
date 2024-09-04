import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import type { Dayjs } from "dayjs";

export const toISODateString = (date: string, timezone: string) => {
    dayjs.extend(utc);
    dayjs.extend(tz);

    return dayjs.tz(date, timezone).toISOString();
};

export const fromISODateString = (date: string, timezone: string) => {
    dayjs.extend(utc);
    dayjs.extend(tz);

    return dayjs(date).tz(timezone);
};

// prettier-ignore
const numbers = [ "〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一" ] as const;

export const getChineseDate = (date: Dayjs) => {
    const year = date
        .year()
        .toString()
        .split("")
        .map(char => numbers[Number(char)])
        .join("");
    const month = numbers[date.month() + 1];
    const day = numbers[date.date()];

    return { year, month, day };
};
