import { getClient } from "server/db";
import { blogConfig } from "share/config";
import { parseConfig } from "share/utils";

import { parseBlog } from "./blog";
import { parsePageFiles, parsePostFiles } from "./file";
import { parseMarkdown } from "./markdown";

export const parser = async () => {
    const client = await getClient();

    const config = parseConfig(blogConfig);
    const postContents = parsePostFiles(config);
    const pageContents = parsePageFiles(config);
    const blog = parseBlog(postContents, pageContents, config);
    const data = await parseMarkdown(blog, config);

    client.init(data);
};
