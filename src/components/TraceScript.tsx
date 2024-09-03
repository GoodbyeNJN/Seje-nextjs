import Script from "next/script";
import { blogConfig } from "virtual-blog-config";

import { addLeadingSlash, join } from "utils/string";

export const TraceScript: React.FC = () => {
    const { google, custom } = blogConfig.trace;

    if (!import.meta.env.PROD) {
        return null;
    }

    return (
        <>
            {custom && (
                <script src={addLeadingSlash(join(import.meta.env.BASE_URL, "/assets", custom))} />
            )}

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
        </>
    );
};
