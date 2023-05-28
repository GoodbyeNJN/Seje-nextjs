"use client";

import { usePathname } from "next/navigation";

import { blogConfig, getMenuItems } from "@/config";

import { Link } from "./link";

export interface HeaderProps {
    className?: string;
}

export const Header: React.FC<HeaderProps> = props => {
    const { className } = props;
    const { title } = blogConfig;

    const pathname = usePathname();

    const menuItems = useMemo(
        () =>
            getMenuItems().map(({ label, link }) => ({
                label,
                link: link === "home" ? "" : link,
            })),
        [],
    );

    const isCurrentItem = useCallback(
        (path: string) => (path ? pathname.includes(path) : pathname === "/"),
        [pathname],
    );

    return (
        <header
            className={cx(
                "border-seje-border flex flex-col items-center justify-center gap-2 border-b py-4",
                className,
            )}
        >
            <div className="text-xl">
                <Link href="/">{title}</Link>
            </div>

            <nav>
                <ul className="text-seje-header-footer flex gap-3">
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
