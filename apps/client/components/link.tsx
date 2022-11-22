import NextLink from "next/link";
import { getRelativePath, isFullUrl } from "share/utils";

export type LinkProps = JSX.IntrinsicElements["a"];

export const Link: React.FC<LinkProps> = props => {
    const { href = "", className, children } = props;

    const url = isFullUrl(href) ? href : getRelativePath(href);
    const target = isFullUrl(href) ? "_blank" : props.target;

    return (
        <NextLink href={url} target={target} className={className}>
            {children}
        </NextLink>
    );
};
