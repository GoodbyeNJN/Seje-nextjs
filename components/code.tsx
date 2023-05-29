"use client";

import { Children, createElement, isValidElement } from "react";

import { blogConfig } from "@/config";
import { useOverflow } from "@/hooks";

interface Props {
    className?: string;
    style?: React.CSSProperties;
}

export interface CodeProps extends Props {
    type: "div" | "span";
    "data-language"?: string;
    "data-rehype-pretty-code-fragment"?: string;
}

interface PreProps {
    divProps: Props;
    preProps: Props;
}

const Pre: React.FC<React.PropsWithChildren<PreProps>> = props => {
    const { children, preProps, divProps } = props;
    const { showLanguage } = blogConfig.code;

    const ref = useRef<HTMLPreElement>(null);
    const isOverflow = useOverflow(ref);

    return (
        <pre
            ref={ref}
            {...divProps}
            {...preProps}
            className={cx(
                divProps.className,
                divProps.className,
                { lang: showLanguage },
                isOverflow ? "overflow" : "no-overflow",
            )}
        >
            {children}
        </pre>
    );
};

export const Code: React.FC<React.PropsWithChildren<CodeProps>> = props => {
    const { children, type, ...rest } = props;

    if (!Object.hasOwn(props, "data-rehype-pretty-code-fragment")) {
        return createElement(type, props);
    }

    if (Children.count(children) === 1 && isValidElement(children) && children.type === "pre") {
        return (
            <Pre divProps={rest} preProps={children.props}>
                {children.props.children}
            </Pre>
        );
    }

    return (
        <>
            {Children.map(children, child =>
                isValidElement(child) && child.type === "pre" ? (
                    <Pre divProps={rest} preProps={child.props}>
                        {child.props.children}
                    </Pre>
                ) : (
                    child
                ),
            )}
        </>
    );
};
