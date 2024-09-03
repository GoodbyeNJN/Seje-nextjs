import { isPlainObject } from "remeda";
import { blogConfig, defaultGoogleApis, defaultGStatic } from "virtual-blog-config";

export const GoogleFont: React.FC = () => {
    const { mirror } = blogConfig.font;

    const font = { googleapis: "", gstatic: "" };
    if (isPlainObject(mirror)) {
        const { googleapis, gstatic } = mirror;
        font.googleapis = googleapis;
        font.gstatic = gstatic;
    } else {
        font.googleapis = defaultGoogleApis[mirror];
        font.gstatic = defaultGStatic[mirror];
    }

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
