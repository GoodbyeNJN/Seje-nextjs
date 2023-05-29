"use client";

import { usePathname } from "next/navigation";

import { blogConfig, getMenuItems } from "@/config";

import { Link } from "./link";

export interface HeaderProps {
    className?: string;
}

const menuItems = getMenuItems().map(({ label, link }) => ({
    label,
    link: link === "home" ? "" : link,
}));

export const Header: React.FC<HeaderProps> = props => {
    const { className } = props;
    const { title } = blogConfig;

    const pathname = usePathname();

    const isCurrentItem = useCallback(
        (path: string) => (path ? pathname.includes(path) : pathname === "/"),
        [pathname],
    );

    return (
        <header
            className={cx(
                "flex flex-col items-center justify-center gap-2 border-b border-seje-border py-4",
                className,
            )}
        >
            <Link href="/" className="text-xl">
                {title}
            </Link>

            <nav>
                <ul className="flex gap-3 text-seje-comment">
                    {menuItems.map(({ label, link }) => (
                        <li
                            key={link}
                            className={cx("hover:text-seje-text", {
                                "text-seje-text": isCurrentItem(link),
                            })}
                        >
                            <Link href={link}>{label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};
