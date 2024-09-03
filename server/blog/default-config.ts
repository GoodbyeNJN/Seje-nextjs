import { schema } from "./schema";

import type { Navbar } from "server/types";

export const defaultBlogConfig = schema.parse({});

export const defaultNavbar: Navbar = [
    { label: "主页", href: "/" },
    { label: "归档", href: "/archives" },
    { label: "分类", href: "/categories" },
    { label: "标签", href: "/tags" },
];

export const defaultGoogleApis = {
    google: "fonts.googleapis.com",
    loli: "fonts.loli.net",
    geekzu: "fonts.geekzu.org",
};

export const defaultGStatic = {
    google: "fonts.gstatic.com",
    loli: "gstatic.loli.net",
    geekzu: "gapis.geekzu.org/g-fonts",
};
