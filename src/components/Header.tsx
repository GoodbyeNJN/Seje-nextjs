import { getHeader } from "data";

import { blogConfig } from "@/config";

import { Image } from "./Image";
import { Link } from "./Link";
import { Navbar } from "./Navbar";

export interface HeaderProps {
    className?: string;
}

const A: React.FC<React.PropsWithChildren<{ href?: string }>> = props => {
    const { href, children } = props;

    return (
        <Link href={href} className="no-underline">
            {children}
        </Link>
    );
};

export const Header: React.FC<HeaderProps> = async props => {
    const { className } = props;
    const { title } = blogConfig;

    const Header = await getHeader();

    return (
        <header
            className={cx(
                "flex flex-col items-center justify-center gap-2 border-b border-seje-border py-4",
                className,
            )}
        >
            {Header ? (
                <Header components={{ img: Image, a: A }} />
            ) : (
                <h1>
                    <A href="/">{title}</A>
                </h1>
            )}

            <Navbar />
        </header>
    );
};
