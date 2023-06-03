import { blogConfig, getFontMirror } from "@/config";
import { joinPathnameWithBasePath } from "@/utils/url";

const gtagId = blogConfig.trace.google;

export const GoogleAnalyticsScript: React.FC = () =>
    gtagId ? (
        <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} />
            <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js", new Date());gtag("config", "${gtagId}")`}</script>
        </>
    ) : null;

export const GoogleTagManagerNoScript: React.FC = () =>
    gtagId ? (
        <noscript>
            <iframe
                sandbox=""
                src={`https://www.googletagmanager.com/ns.html?id=${gtagId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
            />
        </noscript>
    ) : null;

const font = getFontMirror();

export const GoogleFonts: React.FC = () => (
    <>
        <link rel="preconnect" href={`//${font.googleapis}`} />
        <link rel="preconnect" href={`//${font.gstatic}`} crossOrigin="anonymous" />
        <link
            href={`//${font.googleapis}/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Serif+TC:wght@400;700&display=swap`}
            rel="stylesheet"
        />
    </>
);

export const ThemeScript: React.FC = () => (
    <script src={joinPathnameWithBasePath("/assets/theme.js")} />
);
