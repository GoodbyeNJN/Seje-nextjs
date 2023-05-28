import { blogConfig } from "@/config";
import { Page } from "@/db";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseContent } from "./content";
import { parseFile, parsePageFile } from "./file";
import { parsePageLink } from "./permalink";
import { diff } from "./utils";

import type { PageFile } from "./types";

const getPageLink = (page: Page) => {
    const pathname = parsePageLink(page, blogConfig.permalink.page);
    const permalink = joinPathname(page.pathname);

    return { pathname, permalink };
};

const getPageContent = async (page: Page, pageFile: PageFile) => {
    const { contentHash } = pageFile;

    let content = page.content;
    if (page.contentHash !== contentHash) {
        content = await parseContent(pageFile.content);
    }

    return { contentHash, content };
};

export const createPage = async (filepath: string) => {
    const pageFile = parsePageFile(await parseFile(filepath));
    const { filePath, fileHash, title, slug } = pageFile;

    const page = new Page({ filePath, fileHash, title, slug });
    page.assign(await getPageContent(page, pageFile));
    await page.save();

    // 根据更新后的数据，更新链接
    page.assign(getPageLink(page));

    await page.save();
    logger.info(`Page created: ${slug}`);

    return page;
};

export const updatePage = async (filepath: string) => {
    const pageFile = parsePageFile(await parseFile(filepath));
    const { filePath, fileHash, title, slug } = pageFile;

    const page = await Page.findOneBy({ filePath });
    if (!page) {
        return;
    }

    page.assign({ fileHash, title, slug });
    page.assign(await getPageContent(page, pageFile));

    // 根据更新后的数据，更新链接
    page.assign(getPageLink(page));

    await page.save();
    logger.info(`Page updated: ${slug}`);

    return page;
};

export const removePage = async (filePath: string) => {
    const page = await Page.findOneBy({ filePath });
    if (!page) {
        return null;
    }

    await page.remove();
    logger.info(`Page removed: ${page.slug}`);

    return page;
};

export const dispatchPages = async (filepaths: string[]) => {
    const pages = (await Page.find()).map(({ filePath }) => filePath);
    const { create, update, remove } = diff(filepaths, pages);

    for (const filepath of create) {
        await createPage(filepath);
    }

    for (const filepath of update) {
        await updatePage(filepath);
    }

    for (const filepath of remove) {
        await removePage(filepath);
    }
};
