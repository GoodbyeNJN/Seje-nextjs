import NextLink from "next/link";

import { isFullUrl, joinPathname } from "@/utils/url";

export type LinkProps = JSX.IntrinsicElements["a"];

export const Link: React.FC<LinkProps> = props => {
    const { href = "", className, children } = props;

    const url = isFullUrl(href) ? href : joinPathname(href);
    const target = props.target || isFullUrl(href) ? "_blank" : undefined;

    return (
        <NextLink href={url} target={target} className={className}>
            {children}
        </NextLink>
    );
};
