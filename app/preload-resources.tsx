"use client";

import ReactDOM from "react-dom";

export const PreloadResources = () => {
    // @ts-expect-error
    ReactDOM.preconnect("https://fonts.fuckwall.cc", { crossOrigin: "anonymous" });

    return null;
};
