import { blogConfig } from "@/config";
import type { Db, TransactionClient } from "@/prisma";
import { db } from "@/prisma";
import { logger } from "@/utils/logger";
import { joinPathname } from "@/utils/url";

import { parseContent } from "./content";
import { parseFile, parsePageFile } from "./file";
import { parsePageLink } from "./permalink";
import { diff } from "./utils";

import type { PageFile } from "./types";

const updatePageLink = (page: Db.Page) => {
    page.pathname = parsePageLink(page, blogConfig.permalink.page);
    page.permalink = joinPathname(page.pathname);
};

const updatePageContent = async (page: Db.Page, pageFile: PageFile) => {
    page.content = await parseContent(pageFile.content);
};

export const createPage = async (tx: TransactionClient, filepath: string) => {
    const pageFile = parsePageFile(await parseFile(filepath));
    const { filePath, fileHash, contentHash, title, slug } = pageFile;

    const page = await tx.page.create({
        data: {
            filePath,
            fileHash,
            contentHash,
            title,
            slug,
            pathname: "",
            permalink: "",
            content: "",
        },
    });

    // 根据更新后的数据，更新链接
    updatePageLink(page);

    // 更新内容
    await updatePageContent(page, pageFile);

    await page.save(tx);

    logger.info(`Page created: ${slug}`);
};

export const updatePage = async (filepath: string) => {
    const pageFile = parsePageFile(await parseFile(filepath));
    const { filePath, fileHash, contentHash, title, slug } = pageFile;

    const page = await db.page.findUnique({ where: { filePath } });
    if (!page) {
        return;
    }

    page.fileHash = fileHash;
    page.title = title;
    page.slug = slug;

    // 根据更新后的数据，更新链接
    updatePageLink(page);

    // 内容哈希不一致，更新内容
    if (page.contentHash !== contentHash) {
        await updatePageContent(page, pageFile);
        page.contentHash = contentHash;
    }

    await page.save();

    logger.info(`Page updated: ${slug}`);
};

export const removePage = async (filePath: string) => {
    const page = await db.page.findUnique({ where: { filePath } });
    if (!page) {
        return;
    }

    await db.page.delete({ where: { filePath } });

    logger.info(`Page removed: ${page.slug}`);
};

export const dispatchPages = async (filepaths: string[]) => {
    const pages = (await db.page.findMany()).map(({ filePath }) => filePath);
    const { create, update, remove } = diff(filepaths, pages);

    for (const filepath of create) {
        await db.$transaction(tx => createPage(tx, filepath));
    }

    for (const filepath of update) {
        await updatePage(filepath);
    }

    for (const filepath of remove) {
        await removePage(filepath);
    }
};
