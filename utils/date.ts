import dayjs from "dayjs";

// prettier-ignore
const numbers = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一"] as const;

export const getChineseYear = (date: string | Date) =>
    dayjs(date)
        .year()
        .toString()
        .split("")
        .map(char => numbers[Number(char)])
        .join("");

export const getChineseMonth = (date: string | Date) => numbers[dayjs(date).month() + 1] || "";

export const getChineseDate = (date: string | Date) => numbers[dayjs(date).date()] || "";
