"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { isFullUrl } from "@/utils/url";

export type LinkProps = JSX.IntrinsicElements["a"] & {
    exact?: boolean;
    activeClassName?: string;
    inactiveClassName?: string;
};

// 统一处理链接
export const Link: React.FC<LinkProps> = props => {
    const {
        href = "",
        target: _target,
        activeClassName,
        inactiveClassName,
        exact,
        className,
        children,
    } = props;

    const pathname = usePathname();
    const target = _target || isFullUrl(href) ? "_blank" : undefined;

    const isActive = (path?: string) => {
        if (!path || isFullUrl(path)) {
            return false;
        }

        return exact ? pathname === path : pathname.startsWith(path);
    };

    return (
        <NextLink
            href={href}
            target={target}
            className={cx(isActive(href) ? activeClassName : inactiveClassName, className)}
        >
            {children}
        </NextLink>
    );
};
