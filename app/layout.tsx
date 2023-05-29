import { Footer, Header } from "@/components";
import { blogConfig, getFontMirror } from "@/config";
import "@/styles/globals.css";
import { joinPathnameWithBasePath, joinPathnameWithoutPrefix } from "@/utils/url";

import type { Metadata } from "next";

interface Props {
    children?: React.ReactNode;
}

const font = getFontMirror();

const Layout = (props: Props) => {
    const { children } = props;

    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href={`//${font.googleapis}`} />
                <link rel="preconnect" href={`//${font.gstatic}`} crossOrigin="anonymous" />
                <link
                    href={`//${font.googleapis}/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Serif+TC:wght@400;700&display=swap`}
                    rel="stylesheet"
                />

                <script src={joinPathnameWithBasePath("/assets/theme.js")} />
            </head>

            <body
                className="flex min-h-screen flex-col"
                style={{
                    // @ts-expect-error TS2322
                    "--img-load-failed-url": `url("${joinPathnameWithBasePath(
                        "/assets/img-load-failed.svg",
                    )}")`,
                }}
            >
                <Header className="flex-initial" />

                <main className="flex flex-1 flex-col px-2 py-4 sm:px-4 md:px-6 lg:px-8">
                    {children}
                </main>

                <Footer className="flex-initial" />
            </body>
        </html>
    );
};

export const metadata: Metadata = {
    title: {
        default: blogConfig.title,
        template: "%s - " + blogConfig.title,
    },
    description: blogConfig.description,
    keywords: blogConfig.keywords,
    authors: { name: blogConfig.author, url: blogConfig.url },
    applicationName: blogConfig.title,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fff" },
        { media: "(prefers-color-scheme: dark)", color: "#2f2f2f" },
    ],
    viewport: {
        width: "device-width",
        initialScale: 1.0,
    },
    archives: joinPathnameWithoutPrefix(blogConfig.url, "archives"),
    assets: joinPathnameWithoutPrefix(blogConfig.url, "assets"),
};

export default Layout;
