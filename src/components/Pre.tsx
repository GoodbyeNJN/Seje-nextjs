import { blogConfig } from "virtual-blog-config";

type HTMLPreProps = JSX.IntrinsicElements["pre"];

export interface PreProps extends HTMLPreProps {
    "data-language"?: string;
    "data-title"?: string;
}

// 代码块
export const Block: React.FC<PreProps> = props => {
    const { showLanguage } = blogConfig.code;

    const { "data-language": language = "", style, className, children } = props;

    return (
        <div className={cx("group relative", className)} tabIndex={0} style={style}>
            {showLanguage && language !== "plaintext" && (
                <p className="absolute right-2 top-2 select-none text-2xl font-bold opacity-25 transition-opacity group-hover:opacity-0 group-focus:opacity-0">
                    {language}
                </p>
            )}

            <pre className="overflow-x-auto text-base leading-5">
                <code className="inline-block w-[fit-content] min-w-full p-4">{children}</code>
            </pre>
        </div>
    );
};

export const Pre: React.FC<PreProps> = props => {
    const { "data-title": title = "", style, className, children, ...rest } = props;

    return title ? (
        <div
            className={cx(
                "text-shiki-fg bg-shiki-bg my-4 rounded-md font-mono drop-shadow-md",
                className,
            )}
            style={style}
        >
            <p className="border-b border-seje-border px-4 py-3">{title}</p>

            <Block {...rest}>{children}</Block>
        </div>
    ) : (
        <Block
            className={cx(
                "text-shiki-fg bg-shiki-bg my-4 rounded-md font-mono drop-shadow-md",
                className,
            )}
            style={style}
            {...rest}
        >
            {children}
        </Block>
    );
};
