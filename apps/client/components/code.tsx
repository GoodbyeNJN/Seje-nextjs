import { useBoolean, useTheme } from "client/hooks";

export type CodeProps = JSX.IntrinsicElements["pre"];

export const Code: React.FC<CodeProps> = props => {
    const { className, ...rest } = props;

    const { theme } = useTheme();
    const [isHidden, toggleHidden] = useBoolean(true);

    useEffect(() => {
        const match = className?.includes(theme);
        toggleHidden(!match);
    }, [className, theme, toggleHidden]);

    return <pre {...rest} className={cx(className, { hidden: isHidden })} />;
};
