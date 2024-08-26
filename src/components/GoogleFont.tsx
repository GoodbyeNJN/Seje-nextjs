import { blogConfig, googleapisMap, gstaticMap } from "@/config";

export const GoogleFont: React.FC = () => {
    const { mirror } = blogConfig.font;

    const font = { googleapis: "", gstatic: "" };
    if (R.isPlainObject(mirror)) {
        const { googleapis, gstatic } = mirror;
        font.googleapis = googleapis;
        font.gstatic = gstatic;
    } else {
        font.googleapis = googleapisMap[mirror];
        font.gstatic = gstaticMap[mirror];
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
