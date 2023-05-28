import dayjs from "dayjs";

import { blogConfig } from "@/config";

import { DarkModeButton } from "./button";
import { Link } from "./link";

export interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = props => {
    const { className } = props;
    const { showCopyright } = blogConfig.footer;

    return (
        <footer
            className={cx(
                "border-seje-border text-seje-header-footer flex flex-col items-center gap-1 border-t py-4 text-xs",
                className,
            )}
        >
            <DarkModeButton />

            {showCopyright && <p>Copyright © {dayjs().year()} FuckWall</p>}

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
