import { blogConfig } from "virtual-blog-config";

import { Footer } from "client/components/Footer";
import { GoogleFont } from "client/components/GoogleFont";
import { Header } from "client/components/Header";
import { ThemeScript } from "client/components/ThemeScript";
import { TraceScript } from "client/components/TraceScript";

import "client/styles/globals.css";

import type { Metadata, Viewport } from "next";

const Layout: React.FC<React.PropsWithChildren> = props => {
    const { children } = props;

    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                {/* 注意顺序 */}
                <TraceScript />
                <GoogleFont />
                <ThemeScript />
            </head>

            <body
                className={cx(
                    "mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 py-4",
                    "relative break-words bg-seje-body text-seje-text transition-colors",
                    "font-serif text-base xl:text-lg",
                )}
            >
                <Header className="flex-initial" />
                <hr />

                <main className="flex flex-1 flex-col gap-4 px-2 sm:px-4 md:px-6 lg:px-8">
                    {children}
                </main>

                <hr />
                <Footer className="flex-initial" />
            </body>
        </html>
    );
};

export const metadata: Metadata = {
    title: {
        default: blogConfig.title,
        template: `%s | ${blogConfig.title}`,
    },
    description: blogConfig.description,
    keywords: blogConfig.keywords,
    authors: { name: blogConfig.author, url: blogConfig.url },
    applicationName: blogConfig.title,
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fff" },
        { media: "(prefers-color-scheme: dark)", color: "#2f2f2f" },
    ],
    width: "device-width",
    initialScale: 1.0,
};

export default Layout;
