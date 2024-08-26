import { getFooter } from "data";
import dayjs from "dayjs";

import { blogConfig } from "@/config";

import { Image } from "./Image";
import { Link } from "./Link";
import { SwitchThemeButton } from "./SwitchThemeButton";

export interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = async props => {
    const { className } = props;
    const { title } = blogConfig;

    const Footer = await getFooter();

    return (
        <footer
            className={cx(
                "flex flex-col items-center gap-1 border-t border-seje-border py-4 text-xs text-seje-comment",
                className,
            )}
        >
            {Footer ? (
                <Footer components={{ img: Image, a: Link }} />
            ) : (
                <>
                    <SwitchThemeButton />

                    <p>
                        Copyright © {dayjs().year()} {title}
                    </p>

                    <p className="space-x-2">
                        Powered By{" "}
                        <Link href="https://nextjs.org" target="_blank">
                            Next.js
                        </Link>
                        {" | "} Themed By <Link href="/about">Seje</Link>
                    </p>
                </>
            )}
        </footer>
    );
};
