import { isEmpty } from "remeda";

import { defaultNavbar } from "server/blog/default-config";
import { tempNavbarPath } from "server/constants";
import { safeReadJson } from "utils/fs";

import type { Navbar } from "server/types";

export const getNavbarItems = async () => {
    const navbar = await safeReadJson<Navbar>(tempNavbarPath);
    if (!navbar || isEmpty(navbar)) return defaultNavbar;

    return navbar;
};

export const getNavbarItemByHref = async (href: string) => {
    const navbar = await getNavbarItems();

    return navbar.find(item => item.href === href);
};
