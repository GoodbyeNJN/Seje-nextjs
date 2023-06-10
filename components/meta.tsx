"use client";

import Script from "next/script";

import { blogConfig, getFontMirror } from "@/config";
import { isProdEnv } from "@/utils/env";
import { joinPathnameWithBasePath } from "@/utils/url";

export const TraceScript: React.FC = () => {
    const { google, custom } = blogConfig.trace;

    if (!isProdEnv) {
        return null;
    }

    return (
        <>
            {google && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${google}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                    >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js", new Date());gtag("config", "${google}")`}</Script>
                </>
            )}

            {custom && (
                <script dangerouslySetInnerHTML={{ __html: `</script>${custom}<script>` }} />
            )}
        </>
    );
};

export const GoogleFonts: React.FC = () => {
    const font = getFontMirror();

    return (
        <>
            <link rel="preconnect" href={`//${font.googleapis}`} />
            <link rel="preconnect" href={`//${font.gstatic}`} crossOrigin="anonymous" />
            <link
                href={`//${font.googleapis}/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Serif+TC:wght@400;700&display=swap`}
                rel="stylesheet"
            />
        </>
    );
};

export const ThemeScript: React.FC = () => (
    // 此处需要确保脚本优先执行，所以不能使用 next/script
    <script src={joinPathnameWithBasePath("/assets/theme.js")} />
);
