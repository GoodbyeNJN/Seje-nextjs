import { Noto_Serif_SC, Noto_Serif_TC, Ubuntu_Mono } from "next/font/google";

export const notoSerifTC = Noto_Serif_TC({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--noto-serif-tc",
    fallback: [
        "Source Han Serif TC",
        "Source Han Serif",
        "Noto Serif CJK TC",
        "Noto Serif CJK",
        "Noto Serif TC",
        "Noto Serif",
        "serif",
    ],
    display: "swap",
    preload: true,
});

export const notoSerifSC = Noto_Serif_SC({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--noto-serif-sc",
    fallback: [
        "Source Han Serif SC",
        "Source Han Serif",
        "Noto Serif CJK SC",
        "Noto Serif CJK",
        "Noto Serif SC",
        "Noto Serif",
        "serif",
    ],
    display: "swap",
    preload: true,
});

export const utuntuMono = Ubuntu_Mono({
    style: ["normal", "italic"],
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--ubuntu-mono",
    fallback: ["monospace"],
    display: "swap",
    preload: true,
});
