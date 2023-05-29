import dayjs from "dayjs";

import { blogConfig } from "@/config";

import { DarkModeButton } from "./button";
import { Link } from "./link";

export interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = props => {
    const { className } = props;
    const { title } = blogConfig;
    const { showCopyright } = blogConfig.footer;

    return (
        <footer
            className={cx(
                "flex flex-col items-center gap-1 border-t border-seje-border py-4 text-xs text-seje-comment",
                className,
            )}
        >
            <DarkModeButton />

            {showCopyright && (
                <p>
                    Copyright © {dayjs().year()} {title}
                </p>
            )}

            <p className="space-x-2">
                <span>
                    Powered By{" "}
                    <Link href="https://nextjs.org" target="_blank" className="underline">
                        Next.js
                    </Link>
                </span>

                <span>
                    Themed By{" "}
                    <Link href="https://fuckwall.cc/about" target="_blank" className="underline">
                        Seje
                    </Link>
                </span>
            </p>
        </footer>
    );
};
