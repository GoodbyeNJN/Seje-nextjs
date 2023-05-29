import type { PageMarkdown, PostMarkdown } from "./types";

export const isPost = (markdown: PostMarkdown | PageMarkdown): markdown is PostMarkdown =>
    markdown.type === "post";

export const isPage = (markdown: PostMarkdown | PageMarkdown): markdown is PageMarkdown =>
    markdown.type === "page";
