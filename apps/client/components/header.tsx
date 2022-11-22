import { useRouter } from "next/router";
import { blogConfig } from "share/config";

import { Link } from "./link";

export interface HeaderProps {
    className?: string;
}

const getMenuItems = () =>
    Object.entries(blogConfig.menu).map(([key, value]) => ({
        label: value,
        link: (key === "home" ? "" : key) as string,
    }));

export const Header: React.FC<HeaderProps> = props => {
    const { className } = props;
    const { title } = blogConfig;

    const { asPath } = useRouter();

    const isCurrentItem = (path: string) => (path ? asPath.includes(path) : asPath === "/");

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
                    {getMenuItems().map(item => (
                        <li
                            key={item.link}
                            className={cx("hover:text-seje-text", {
                                "text-seje-text": isCurrentItem(item.link),
                            })}
                        >
                            <Link href={item.link}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};
