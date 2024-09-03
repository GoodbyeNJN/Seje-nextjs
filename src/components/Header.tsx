import { blogConfig } from "virtual-blog-config";

import { getComponentByType } from "server/api/components";

import { Image } from "./Image";
import { LinkNoUnderline } from "./Link";
import { Navbar } from "./Navbar";

export interface HeaderProps extends React.PropsWithClassName {}

const A: React.FC<React.PropsWithChildren<{ href?: string }>> = props => {
    const { href, children } = props;

    return <LinkNoUnderline href={href}>{children}</LinkNoUnderline>;
};

const P: React.FC<React.PropsWithChildren<React.PropsWithClassName>> = props => {
    const { className, children } = props;

    return <p className={cx("text-sm text-seje-comment", className)}>{children}</p>;
};

export const Header: React.FC<HeaderProps> = async props => {
    const { className } = props;
    const { title } = blogConfig;

    const Header = await getComponentByType("header");

    return (
        <header className={cx("flex flex-col items-center justify-center gap-2", className)}>
            {Header ? (
                <Header components={{ img: Image, a: A, p: P }} />
            ) : (
                <h1>
                    <A href="/">{title}</A>
                </h1>
            )}

            <Navbar />
        </header>
    );
};
