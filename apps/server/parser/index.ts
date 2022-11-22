import { db } from "server/db";

import { parseBlog } from "./blog";
import { getCacheDiffs, parseCacheDiff, putCacheDiffs } from "./cache";
import { parseFiles } from "./file";
import { parseMarkdown } from "./markdown";

let prev = 0;
const logger = (str: string) => {
    const next = Date.now();
    console.log(`[${prev ? next - prev : prev}ms] ${str}`);
    prev = next;
};

export const parser = async (isWatchMode?: boolean) => {
    prev = 0;
    logger("start parser");

    const files = await parseFiles();
    logger("parse files");

    const diffs = await getCacheDiffs(files, isWatchMode);
    logger("get cache diffs");

    const blog = parseBlog(parseCacheDiff(diffs));
    logger("parse blog");

    const markdown = await parseMarkdown(blog);
    logger("parse markdown");

    await db.merge(markdown);
    await putCacheDiffs(diffs);
    logger("db update");
    logger("end parser");

    // const postContents = await parsePostFile();
    // logger("parse post files");

    // const pageContents = await parsePageFiles();
    // logger("parse page files");

    // const blog = parseBlog(postContents, pageContents);
    // logger("parse blog");

    // const data = await parseMarkdown(blog);
    // logger("parse markdown");

    // db.update(data);
    // logger("init client");
};
