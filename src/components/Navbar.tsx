import { getNavbar } from "data";

import { defaultNavbar } from "@/config";

import { Link } from "./Link";

export interface NavbarProps {
    className?: string;
}

const Ul: React.FC<React.PropsWithChildren> = props => {
    const { children } = props;
    return <ul className="flex gap-3 text-seje-comment">{children}</ul>;
};

const A: React.FC<React.PropsWithChildren<{ href?: string }>> = props => {
    const { href, children } = props;

    return (
        <Link
            href={href}
            exact
            activeClassName="text-seje-text"
            className="no-underline hover:text-seje-text"
        >
            {children}
        </Link>
    );
};

export const Navbar: React.FC<NavbarProps> = async props => {
    const { className } = props;

    const Navbar = await getNavbar();

    return (
        <nav className={className}>
            {Navbar ? (
                <Navbar components={{ ul: Ul, a: A }} />
            ) : (
                <Ul>
                    {defaultNavbar.map(({ label, href }) => (
                        <li key={href}>
                            <A href={href}>{label}</A>
                        </li>
                    ))}
                </Ul>
            )}
        </nav>
    );
};
