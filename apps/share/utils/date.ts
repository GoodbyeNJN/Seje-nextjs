import dayjs from "dayjs";

export interface DateOptions {
    show: boolean;
    suffix?: string;
}

export interface FormatOptions {
    year?: DateOptions;
    month?: DateOptions;
    date?: DateOptions;
}

export interface Date {
    year: string | number;
    month: string | number;
    date: string | number;
}

// prettier-ignore
const numbers = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一"];

const joinDate = (dateObj: Date, options: FormatOptions) => {
    const { year, month, date } = dateObj;

    let string = "";
    const { year: yearOptions, month: monthOptions, date: dateOptions } = options;

    if (yearOptions?.show) {
        string += year + (yearOptions.suffix || "");
    }
    if (monthOptions?.show) {
        string += month + (monthOptions.suffix || "");
    }
    if (dateOptions?.show) {
        string += date + (dateOptions.suffix || "");
    }

    return string;
};

/**
 * 将数字格式的日期转换为中文格式，可手动指定中文格式的分隔字符
 */
export const getChineseDate = (digitDate: string, options: FormatOptions) => {
    const day = dayjs(digitDate);
    const year = day
        .year()
        .toString()
        .split("")
        .map(char => numbers[Number(char)])
        .join("");
    const month = numbers[day.month() + 1];
    const date = numbers[day.date()];

    return joinDate({ year, month, date }, options);
};
