import path from "node:path";

import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { filter, isEmpty, isTruthy, map, pipe } from "remeda";
import strip from "strip-markdown";
import { parse, stringify } from "yaml";

import { getBlogConfig } from "server/blog/validate";
import { getValuesFromProcessEnv } from "server/utils/env";
import { toISODateString } from "utils/date";
import { createDebugger } from "utils/debug";
import {
    permalinkToSlug,
    removeLeadingDot,
    removeLeadingUnderscore,
    slugToPermalink,
} from "utils/string";

import { recmaImportImage } from "./recma-import-image";
import { recmaToModule } from "./recma-to-module";
import { rehypeImage } from "./rehype-image";
import { rehypeShiki } from "./rehype-shiki";
import { remarkCollectList } from "./remark-collect-list";

import type { Category, Metadata, Tag } from "server/types";
import type { VFile } from "server/utils/vfile";

const debug = createDebugger("[mdx-transform]");

const { isDev } = getValuesFromProcessEnv();

const blogConfig = getBlogConfig();
const { timezone } = blogConfig.date;

const mdToText = async (md: string) => {
    // debug.start("Convert markdown to text");

    const { value } = await remark().use(strip).process(md);
    const text = value.toString().replaceAll("\n\n", "\n").trim();

    // debug.end("Convert markdown to text");

    return text;
};

export const transformPage = async (vfile: VFile) => {
    debug.start("Transform to page");

    const { value } = await compile(
        { ...vfile, path: vfile.pathname },
        {
            development: isDev,
            jsx: true,
            providerImportSource: "client/mdx-components",

            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeImage, rehypeShiki],
            recmaPlugins: [recmaImportImage],
        },
    );

    const content = value.toString();

    debug.end("Transform to page");

    return content;
};

export const transformSummary = async (vfile: VFile) => {
    debug.start("Transform to summary");

    const { value } = await compile(
        { ...vfile, path: vfile.pathname },
        {
            outputFormat: "function-body",
            providerImportSource: "client/mdx-components",

            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeImage, rehypeShiki],
            recmaPlugins: [recmaImportImage, recmaToModule],
        },
    );

    const content = value.toString();

    debug.end("Transform to summary");

    return content;
};

export const transformComponent = async (vfile: VFile) => {
    debug.start("Transform to component");

    const { value } = await compile(
        { ...vfile, path: vfile.pathname },
        {
            development: isDev,
            jsx: true,
            providerImportSource: "client/mdx-components",

            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeImage, rehypeShiki],
            recmaPlugins: [recmaImportImage],
        },
    );

    const content = value.toString();

    debug.end("Transform to component");

    return content;
};

export const transformNavbarComponent = async (vfile: VFile) => {
    debug.start("Transform to navbar component");

    const { data } = await compile(
        { ...vfile, path: vfile.pathname },
        {
            remarkPlugins: [remarkCollectList],
        },
    );

    const content = isDev ? JSON.stringify(data.list, null, 2) : JSON.stringify(data.list);

    debug.end("Transform to navbar component");

    return content;
};

export const parseMdxFile = async (vfile: VFile) => {
    // debug.start("Parse MDX file");

    const { name, ext } = path.parse(vfile.filename);
    const filename = removeLeadingUnderscore(name);
    const type = removeLeadingDot(ext || ".post") as "post" | "page";
    const permalink = slugToPermalink([vfile.dirname, filename]);
    const slug = permalinkToSlug(permalink, isDev);

    const {
        data,
        excerpt: summary = "",
        content: page,
    } = matter(vfile.value, {
        excerpt: true,
        engines: { yaml: { parse, stringify } },
    });

    const title = ((data.title as Nullable<string>) || "").toString();
    const created = toISODateString(
        ((data.created as Nullable<string>) || "1970-01-01T00:00:00").toString(),
        timezone,
    );
    const updated = toISODateString(
        ((data.updated as Nullable<string>) || "1970-01-01T00:00:00").toString(),
        timezone,
    );
    const categories = pipe(
        data.categories || [],
        filter<Nullable<string>, string>(isTruthy),
        map(title => title.toString()),
        map((title): Category => {
            const permalink = slugToPermalink(["categories", title]);
            const slug = permalinkToSlug(permalink, isDev);

            return { title, permalink, slug };
        }),
    );
    const tags = pipe(
        data.tags || [],
        filter<Nullable<string>, string>(isTruthy),
        map(title => title.toString()),
        map((title): Tag => {
            const permalink = slugToPermalink(["tags", title]);
            const slug = permalinkToSlug(permalink, isDev);

            return { title, permalink, slug };
        }),
    );
    const description = isEmpty(summary) ? "" : await mdToText(summary);
    const keywords = [...tags].map(({ title }) => title);

    const metadata: Metadata = {
        type,
        title,
        permalink,
        slug,
        created,
        updated,
        categories,
        tags,
        description,
        keywords,
    };

    // debug.end("Parse MDX file");

    return { metadata, summary, page };
};
