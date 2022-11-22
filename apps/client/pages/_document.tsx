import { FirstLoadScript } from "client/components";
import { Head, Html, Main, NextScript } from "next/document";
import { blogConfig } from "share/config";

import type { NextPage } from "next";

const Document: NextPage = () => {
    return (
        <Html lang="zh-CN">
            <Head>
                <meta name="description" content={blogConfig.description} />
                <link rel="icon" href="/favicon.ico" />

                <link rel="preconnect" href="https://fonts.loli.net" />
                <link rel="preconnect" href="https://gstatic.loli.net" crossOrigin="anonymous" />
            </Head>

            <body>
                <FirstLoadScript />

                <Main />
                <NextScript />

                <link
                    href="https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Serif+TC:wght@400;700&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                    rel="stylesheet"
                />
            </body>
        </Html>
    );
};

export default Document;
