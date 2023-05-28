import path from "node:path";

import fastq from "fastq";
import _ from "lodash";

import { resourceAbsolutePath, resourceDirName } from "@/config/resource";
import { isProdEnv } from "@/utils/env";
import { logger } from "@/utils/logger";

import { createPage, dispatchPages, removePage, updatePage } from "./page";
import { createPost, dispatchPosts, removePost, updatePost } from "./post";
import { type Event, Watcher } from "./watcher";

const isPagePath = (filepath: string) => filepath.startsWith(resourceDirName.pages);
const isPostPath = (filepath: string) => filepath.startsWith(resourceDirName.posts);

const dispatchEvent = async (event: Event) => {
    // TODO: 入库时注意排序，保证每次入库生成的 id 一致
    switch (event.type) {
        case "ready": {
            const filepaths = event.paths.map(filepath =>
                path.relative(process.env.BLOG_PATH, filepath),
            );

            logger.info("Files ready:");
            filepaths.map(filepath => `  ${filepath}`).forEach(_.unary(logger.info));

            await dispatchPages(filepaths.filter(isPagePath));
            await dispatchPosts(filepaths.filter(isPostPath));

            break;
        }
        case "create": {
            const filepath = path.relative(process.env.BLOG_PATH, event.path);

            logger.info(`File created:`, filepath);

            if (isPagePath(filepath)) {
                await createPage(filepath);
            } else {
                await createPost(filepath);
            }

            break;
        }
        case "update": {
            const filepath = path.relative(process.env.BLOG_PATH, event.path);

            logger.info(`File updated:`, filepath);

            if (isPagePath(filepath)) {
                await updatePage(filepath);
            } else {
                await updatePost(filepath);
            }

            break;
        }
        case "remove": {
            const filepath = path.relative(process.env.BLOG_PATH, event.path);

            logger.info(`File removed:`, filepath);

            if (isPagePath(filepath)) {
                await removePage(filepath);
            } else {
                await removePost(filepath);
            }

            break;
        }
    }
};

logger.info("Start watching markdown files...");

const { posts, pages } = resourceAbsolutePath;
const filePatterns = [posts, pages].map(dir => path.resolve(dir, "**/*.md"));

const queue = fastq.promise(dispatchEvent, 1);
const watcher = new Watcher(filePatterns).on("event", queue.push);
if (isProdEnv) {
    watcher.close();
}
