"use client";

import { useOverflow } from "hooks";

import { blogConfig } from "@/config";

export type PreProps = JSX.IntrinsicElements["pre"] & {
    "data-language"?: string;
    "data-title"?: string;
    "data-total-line"?: string;
    "data-highlighted-lines"?: string;
    "data-inserted-lines"?: string;
    "data-removed-lines"?: string;
};

const parseLines = (lines = "") => lines.split(",").map(line => parseInt(line, 10));

// 代码块
export const Pre: React.FC<PreProps> = props => {
    const { showLanguage, showLineNumber } = blogConfig.code;
    const {
        "data-language": language = "",
        "data-title": title = "",
        className,
        children,
        ...rest
    } = props;
    const totalLine = parseLines(props["data-total-line"])[0] || NaN;
    const highlightedLines = parseLines(props["data-highlighted-lines"]);
    const insertedLines = parseLines(props["data-inserted-lines"]);
    const removedLines = parseLines(props["data-removed-lines"]);

    const showDiffStatus = !R.isEmpty(insertedLines) || !R.isEmpty(removedLines);
    const showStatusColumn = totalLine > 0 && (showLineNumber || showDiffStatus);
    const lines = R.range(1, totalLine + 1);

    // 展示语言时，处理语言标签的位置
    const ref = useRef<HTMLPreElement>(null);
    const isOverflow = useOverflow(ref);

    return (
        <pre
            ref={ref}
            {...rest}
            className={cx(
                "flex flex-wrap",
                { lang: showLanguage, indexed: showLineNumber },
                // isOverflow ? "overflow" : "no-overflow",
                className,
            )}
        >
            {title && (
                <div className="flex-shrink-0 basis-full">
                    <span className="title">{title}</span>
                </div>
            )}

            {/* <div className={cx("py-4", showStatusColumn && "flex")}> */}
            {showStatusColumn && (
                <p className="flex flex-col">
                    {lines.map(line => (
                        <span key={line} className="pl-4 pr-3">
                            {showLineNumber && (
                                <span>
                                    {line.toString().padStart(totalLine.toString().length, " ")}
                                </span>
                            )}

                            {showDiffStatus && (
                                <span>
                                    {insertedLines.includes(line)
                                        ? "+"
                                        : removedLines.includes(line)
                                          ? "-"
                                          : " "}
                                </span>
                            )}
                        </span>
                    ))}
                </p>
            )}

            <code className="flex-1">{children}</code>
        </pre>
    );
};
