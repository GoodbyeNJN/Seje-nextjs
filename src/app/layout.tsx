import { Footer, GoogleFont, Header, ModalContainer, ThemeScript, TraceScript } from "components";
import "styles/globals.css";

import { blogConfig } from "@/config";
import { join } from "@/utils/url";

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

            <body className="flex min-h-screen flex-col">
                <Header className="flex-initial" />

                <ModalContainer>
                    <main className="flex flex-1 flex-col px-2 py-6 sm:px-4 md:px-6 lg:px-8">
                        {children}
                    </main>
                </ModalContainer>

                <Footer className="flex-initial" />
            </body>
        </html>
    );
};

export const metadata: Metadata = {
    title: {
        default: blogConfig.title,
        template: "%s | " + blogConfig.title,
    },
    description: blogConfig.description,
    keywords: blogConfig.keywords,
    authors: { name: blogConfig.author, url: blogConfig.url },
    applicationName: blogConfig.title,
    archives: join(blogConfig.url, "archives"),
    assets: join(blogConfig.url, "assets"),
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
