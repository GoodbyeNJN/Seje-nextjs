import { defaultNavbar } from "virtual-blog-config";

import { getComponentByType } from "server/api/components";

import { LinkNoUnderline } from "./Link";

export interface NavbarProps extends React.PropsWithClassName {}

const Ul: React.FC<React.PropsWithChildren> = props => {
    const { children } = props;

    return <ul className="flex gap-3 text-seje-comment">{children}</ul>;
};

const A: React.FC<React.PropsWithChildren<{ href?: string }>> = props => {
    const { href, children } = props;

    return (
        <LinkNoUnderline
            href={href}
            activeClassName="text-seje-text"
            className="hover:text-seje-text"
        >
            {children}
        </LinkNoUnderline>
    );
};

export const Navbar: React.FC<NavbarProps> = async props => {
    const { className } = props;

    const Navbar = await getComponentByType("navbar");

    return (
        <nav className={cx("flex flex-col items-center justify-center", className)}>
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
