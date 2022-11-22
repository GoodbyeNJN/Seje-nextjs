import { useTheme } from "client/hooks";

export type CodeProps = JSX.IntrinsicElements["pre"] & {
    "data-language"?: string;
    "data-code"?: string;
};

export const Code: React.FC<CodeProps> = props => {
    const { className, "data-language": lang, ...rest } = props;

    const { theme } = useTheme();

    return (
        <div className="relative my-4">
            {lang && (
                <span className="absolute top-1 right-1.5 select-none font-mono text-2xl font-bold leading-none opacity-25">
                    {lang.toUpperCase()}
                </span>
            )}

            <pre {...rest} className={cx(className, theme)} />
        </div>
    );
};
