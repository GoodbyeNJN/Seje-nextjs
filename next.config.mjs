var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// next.config.ts
import * as R6 from "remeda";
import createBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import Unimport from "unimport/unplugin";
import webpack from "webpack";

// config/config.ts
import userBlogConfig from "./blog/config.js";
var defaultBlogConfig = {
  title: "Yet Another Blog",
  description: "Yet another blog powered by Next.js and themed by Seje.",
  keywords: [],
  author: "",
  url: "https://example.com",
  home: {
    showSummary: true,
    showReadMore: true,
    showPagination: true,
    postsPerPage: 5
  },
  post: {
    prependPostSummary: false,
    prependPageSummary: false,
    showPostCategories: true,
    showPostTags: true,
    showPageTitle: false
  },
  menu: {
    defaultItems: {
      home: "\u4E3B\u9875",
      archives: "\u5F52\u6863",
      categories: "\u5206\u7C7B",
      tags: "\u6807\u7B7E"
    },
    customItems: {}
  },
  footer: {
    showCopyright: true
  },
  date: {
    showDateInPost: true,
    showDateInPage: false,
    showCreatedOrUpdated: "created",
    showDetailTooltip: true
  },
  font: {
    mirror: "google"
  },
  code: {
    theme: { dark: "dark-plus", light: "light-plus" },
    showLanguage: true,
    showLineNumber: true
  },
  trace: {}
};
var blogConfig = {
  ...defaultBlogConfig,
  ...userBlogConfig,
  home: {
    ...defaultBlogConfig.home,
    ...userBlogConfig.home
  },
  post: {
    ...defaultBlogConfig.post,
    ...userBlogConfig.post
  },
  menu: {
    defaultItems: {
      ...defaultBlogConfig.menu.defaultItems,
      ...userBlogConfig.menu?.defaultItems
    },
    customItems: {
      ...defaultBlogConfig.menu.customItems,
      ...userBlogConfig.menu?.customItems
    }
  },
  footer: {
    ...defaultBlogConfig.footer,
    ...userBlogConfig.footer
  },
  date: {
    ...defaultBlogConfig.date,
    ...userBlogConfig.date
  },
  font: {
    ...defaultBlogConfig.font,
    ...userBlogConfig.font
  },
  code: {
    ...defaultBlogConfig.code,
    ...userBlogConfig.code
  },
  trace: {
    ...defaultBlogConfig.trace,
    ...userBlogConfig.trace
  }
};

// config/getter.ts
import * as R from "remeda";
var getBasePath = () => {
  const { pathname } = new URL(blogConfig.url);
  return pathname;
};

// config/schema.ts
import { z } from "zod";

// mdx/index.ts
import { compile } from "@mdx-js/mdx";
import { recmaImportImages } from "recma-import-images";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

// mdx/content.ts
import { builders, traverse } from "estree-toolkit";

// mdx/utils.ts
var utils_exports = {};
__export(utils_exports, {
  getPermalink: () => getPermalink,
  isElement: () => isElement,
  jsToTree: () => jsToTree,
  mdToText: () => mdToText,
  treeToJs: () => treeToJs,
  visitAsync: () => visitAsync
});
import path2 from "node:path";
import { generate } from "astring";
import { parse } from "meriyah";
import { remark } from "remark";
import strip from "strip-markdown";
import { is } from "unist-util-is";
import { visit } from "unist-util-visit";

// utils/path.ts
import path from "node:path";
import url from "node:url";
import glob from "fast-glob";
var getProjectPath = () => {
  const filepath = url.fileURLToPath(import.meta.url);
  const { base, dir } = path.parse(filepath);
  if (base === "path.ts") {
    return path.resolve(dir, "..");
  } else if (base === "next.config.mjs") {
    return dir;
  } else {
    console.warn("\u83B7\u53D6\u9879\u76EE\u8DEF\u5F84\u51FA\u73B0\u5F02\u5E38\uFF0C\u5C06\u4F7F\u7528\u9ED8\u8BA4\u9879\u76EE\u8DEF\u5F84\uFF0C\u8BF7\u68C0\u67E5\u662F\u5426\u6B63\u786E");
    console.warn("\u9ED8\u8BA4\u9879\u76EE\u8DEF\u5F84\u4E3A:", dir);
    return dir;
  }
};
var getNextPath = () => path.resolve(getProjectPath(), "src");
var getNextMarkdownPath = () => path.resolve(getNextPath(), "app/(markdowns)");
var getBlogPath = () => path.resolve(getProjectPath(), "blog");
var getBlogPostPath = () => path.resolve(getBlogPath(), "posts");
var getBlogLayoutPath = () => path.resolve(getBlogPath(), "layouts");

// utils/url.ts
import * as R2 from "remeda";
var join = (...paths) => {
  const separator = "/";
  let pathname = "";
  for (const path4 of paths) {
    let part = path4.startsWith(separator) ? path4.slice(separator.length) : path4;
    part = part.endsWith(separator) ? part.slice(0, -separator.length) : part;
    if (part) {
      pathname += pathname ? separator + part : part;
    }
  }
  return pathname;
};
var joinInAbsolute = (...paths) => "/" + join(...paths);
var isFullUrl = (str) => {
  try {
    const url2 = new URL(str);
    return R2.isTruthy(url2.protocol);
  } catch {
    return false;
  }
};

// mdx/utils.ts
__reExport(utils_exports, unist_util_visit_star);
import * as unist_util_visit_star from "unist-util-visit";
var isElement = (node, tagName) => {
  const test = { type: "element" };
  if (tagName) {
    test.tagName = tagName;
  }
  if (!is(node, test)) {
    return false;
  }
  return true;
};
var visitAsync = async (tree, check, asyncVisitor, result) => {
  const matches = [];
  visit(tree, check, (...args) => {
    matches.push(args);
    return result;
  });
  const promises = matches.map((match) => asyncVisitor(...match));
  await Promise.all(promises);
};
var jsToTree = (js) => parse(js, { module: true, jsx: true });
var treeToJs = (tree) => generate(tree);
var mdToText = async (md) => {
  const { value } = await remark().use(strip, {
    remove: [
      [
        // 处理 rehype-pretty-code 拓展的行内代码语法
        "inlineCode",
        ({ value: value2, ...rest }) => ({
          ...rest,
          value: value2.replace(/{:[a-zA-Z.-]+}$/, "")
        })
      ]
    ]
  }).process(md);
  return value.toString().replaceAll("\n\n", "\n").trim();
};
var getPermalink = (filepath) => {
  const relative = path2.relative(getNextMarkdownPath(), filepath);
  return joinInAbsolute(path2.dirname(relative));
};

// mdx/content.ts
var appendPermalink = async (node, permalink) => {
  const path4 = await new Promise((resolve) => {
    traverse(node, {
      FunctionDeclaration(path5) {
        if (path5.node?.id.name !== "MDXContent") return;
        path5.traverse({
          ReturnStatement(path6) {
            const { argument } = path6.node || {};
            if (argument?.type !== "ConditionalExpression" || argument.test.type !== "Identifier" || argument.test.name !== "MDXLayout") {
              return;
            }
            path6.traverse({
              ObjectExpression(path7) {
                path7.traverse({
                  SpreadElement(path8) {
                    const { argument: argument2 } = path8.node || {};
                    if (argument2?.type !== "Identifier" || argument2.name !== "props") {
                      return;
                    }
                    this.stop();
                    resolve(path8);
                  }
                });
              }
            });
          }
        });
      }
    });
    resolve(null);
  });
  if (!path4) return;
  const property = builders.property(
    "init",
    builders.identifier("permalink"),
    builders.literal(permalink)
  );
  path4.insertAfter([property]);
};
var exportCreateMdxContent = async (node) => {
  const path4 = await new Promise((resolve) => {
    traverse(node, {
      FunctionDeclaration(path5) {
        if (path5.node?.id.name !== "_createMdxContent") {
          return;
        }
        this.stop();
        resolve(path5);
      }
    });
    resolve(null);
  });
  if (!path4) return;
  const exportedFn = builders.exportNamedDeclaration(path4.node);
  path4.replaceWith(exportedFn);
};
var recmaContent = () => async (tree, file, next) => {
  await appendPermalink(tree, getPermalink(file.path));
  await exportCreateMdxContent(tree);
  next(void 0, tree);
};

// mdx/export.ts
import * as R3 from "remeda";
import { valueToEstree } from "estree-util-value-to-estree";
import { parse as parseYaml } from "yaml";
var isYamlNode = (node) => node.type === "yaml";
var parseFrontmatter = (frontmatter) => {
  const type = frontmatter.type || "post";
  const title = frontmatter.title || "";
  const created = frontmatter.created || "1970-01-01";
  const updated = frontmatter.updated || "1970-01-01";
  const categories = R3.filter(frontmatter.categories || [], R3.isTruthy);
  const tags = R3.filter(frontmatter.tags || [], R3.isTruthy);
  const summary = frontmatter.summary || "";
  return { type, title, created, updated, categories, tags, summary };
};
var remarkExport = () => async (tree, file, next) => {
  await visitAsync(
    tree,
    isYamlNode,
    async (node) => {
      const frontmatter = parseFrontmatter(parseYaml(node.value));
      const permalink = getPermalink(file.path);
      const description = await mdToText(frontmatter.summary);
      const keywords = frontmatter.tags;
      const metadata = { ...frontmatter, permalink, description, keywords };
      tree.children.unshift({
        type: "mdxjsEsm",
        value: "",
        data: {
          estree: {
            type: "Program",
            sourceType: "module",
            body: [
              {
                type: "ExportNamedDeclaration",
                specifiers: [],
                declaration: {
                  type: "VariableDeclaration",
                  kind: "const",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: { type: "Identifier", name: "metadata" },
                      init: valueToEstree(metadata)
                    }
                  ]
                }
              }
            ]
          }
        }
      });
    },
    utils_exports.EXIT
  );
  next(void 0, tree);
};

// mdx/image.ts
import * as R4 from "remeda";
import fs from "node:fs";
import path3 from "node:path";
import { getPlaiceholder } from "plaiceholder";

// utils/logger.ts
import chalk from "chalk";
var format = (level) => {
  const map = {
    info: `${chalk.cyan(level)} `,
    warn: `${chalk.yellow(level)} `,
    error: `${chalk.red(level)}`,
    default: `${chalk.green(level)}`
  };
  return map[level] || map.default;
};
var logger = (...args1) => (...args2) => console.log(...args1, ...args2);
var info = format("info");
var warn = format("warn");
var error = format("error");
var createLogger = (prefix) => prefix ? { info: logger(prefix, info), warn: logger(prefix, warn), error: logger(prefix, error) } : { info: logger(info), warn: logger(warn), error: logger(error) };

// mdx/image.ts
var logger2 = createLogger("[rehype-image]");
var isImgElement = (node) => isElement(node, "img") && R4.isString(node.properties.src);
var getLocalImagePath = (src, filepath) => {
  if (fs.existsSync(src)) {
    return src;
  }
  const { name } = path3.parse(filepath);
  let imagePath = "";
  if (path3.isAbsolute(src)) {
    const relativeImagePath = path3.relative("/", src);
    imagePath = path3.resolve(getBlogPath(), relativeImagePath);
  } else if (name === "page") {
    const relativeFilePath = path3.relative(getNextMarkdownPath(), filepath);
    const relativeFileBasepath = path3.join(relativeFilePath, "../..");
    const imageBasepath = path3.resolve(getBlogPostPath(), relativeFileBasepath);
    imagePath = path3.resolve(imageBasepath, src);
  } else {
    imagePath = path3.resolve(getBlogLayoutPath(), src);
  }
  return fs.existsSync(imagePath) ? imagePath : void 0;
};
var getRemoteImageInfo = async (src) => {
  let buffer;
  try {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (error2) {
    logger2.error("\u52A0\u8F7D\u7F51\u7EDC\u56FE\u7247\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u9519\u8BEF\u4FE1\u606F:");
    logger2.error(error2);
    return null;
  }
  try {
    const info2 = await getPlaiceholder(buffer);
    return info2;
  } catch (error2) {
    logger2.error("\u83B7\u53D6\u7F29\u7565\u56FE\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u9519\u8BEF\u4FE1\u606F:");
    logger2.error(error2);
    return null;
  }
};
var rehypeImage = () => async (tree, file, next) => {
  await visitAsync(tree, isImgElement, async (node) => {
    const { src } = node.properties;
    if (!isFullUrl(src)) {
      const imagePath = getLocalImagePath(src, file.path);
      node.properties = { ...node.properties, type: "local", src: imagePath || src };
      node.properties.src = imagePath || src;
      return;
    }
    const info2 = await getRemoteImageInfo(src);
    if (!info2) {
      node.properties = {
        ...node.properties,
        type: "remote",
        src,
        width: 512,
        height: 512,
        // img-load-failed.svg 的 base64 编码
        base64: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDI0IDEwMjQnIHdpZHRoPScyMDAnIGhlaWdodD0nMjAwJz48cGF0aCBkPSdNMzA0LjEyOCA0NTYuMTkyYzQ4LjY0IDAgODguMDY0LTM5LjQyNCA4OC4wNjQtODguMDY0cy0zOS40MjQtODguMDY0LTg4LjA2NC04OC4wNjQtODguMDY0IDM5LjQyNC04OC4wNjQgODguMDY0IDM5LjQyNCA4OC4wNjQgODguMDY0IDg4LjA2NHptMC0xMTYuMjI0YzE1LjM2IDAgMjguMTYgMTIuMjg4IDI4LjE2IDI4LjE2cy0xMi4yODggMjguMTYtMjguMTYgMjguMTYtMjguMTYtMTIuMjg4LTI4LjE2LTI4LjE2IDEyLjI4OC0yOC4xNiAyOC4xNi0yOC4xNnonLz48cGF0aCBkPSdNODg3LjI5NiAxNTkuNzQ0SDEzNi43MDRDOTYuNzY4IDE1OS43NDQgNjQgMTkyIDY0IDIzMi40NDh2NTU5LjEwNGMwIDM5LjkzNiAzMi4yNTYgNzIuNzA0IDcyLjcwNCA3Mi43MDRoMTk4LjE0NEw1MDAuMjI0IDY4OC42NGwtMzYuMzUyLTIyMi43MiAxNjIuMzA0LTEzMC41Ni02MS40NCAxNDMuODcyIDkyLjY3MiAyMTQuMDE2LTEwNS40NzIgMTcxLjAwOGgzMzUuMzZDOTI3LjIzMiA4NjQuMjU2IDk2MCA4MzIgOTYwIDc5MS41NTJWMjMyLjQ0OGMwLTM5LjkzNi0zMi4yNTYtNzIuNzA0LTcyLjcwNC03Mi43MDR6bS0xMzguNzUyIDcxLjY4di41MTJIODU3LjZjMTYuMzg0IDAgMzAuMjA4IDEzLjMxMiAzMC4yMDggMzAuMjA4djM5OS44NzJMNjczLjI4IDQwOC4wNjRsNzUuMjY0LTE3Ni42NHpNMzA0LjY0IDc5Mi4wNjRIMTY1Ljg4OGMtMTYuMzg0IDAtMzAuMjA4LTEzLjMxMi0zMC4yMDgtMzAuMjA4di05LjcyOGwxMzguNzUyLTE2NC4zNTIgMTA0Ljk2IDEyNC40MTYtNzQuNzUyIDc5Ljg3MnptODEuOTItMzU1Ljg0bDM3LjM3NiAyMjguODY0LS41MTIuNTEyLTE0Mi44NDgtMTY5Ljk4NGMtMy4wNzItMy41ODQtOS4yMTYtMy41ODQtMTIuMjg4IDBMMTM1LjY4IDY1Mi44VjI2Mi4xNDRjMC0xNi4zODQgMTMuMzEyLTMwLjIwOCAzMC4yMDgtMzAuMjA4aDQ3NC42MjRMMzg2LjU2IDQzNi4yMjR6bTUwMS4yNDggMzI1LjYzMmMwIDE2Ljg5Ni0xMy4zMTIgMzAuMjA4LTI5LjY5NiAzMC4yMDhINjgwLjk2bDU3LjM0NC05My4xODQtODcuNTUyLTIwMi4yNCA3LjE2OC03LjY4IDIyOS44ODggMjcyLjg5NnonLz48L3N2Zz4="
      };
      return;
    }
    const { metadata, base64 } = info2;
    const { width, height } = metadata;
    node.properties = { ...node.properties, type: "remote", src, width, height, base64 };
  });
  next(void 0, tree);
};

// mdx/summary.ts
import * as R5 from "remeda";
import { builders as builders2, traverse as traverse2 } from "estree-toolkit";
var findSummaryPropertyValue = (node) => new Promise((resolve) => {
  traverse2(node, {
    VariableDeclarator(path4) {
      const { id } = path4.node || {};
      if (id?.type !== "Identifier" || id.name !== "metadata") {
        return;
      }
      path4.traverse({
        Property(path5) {
          const { key, value } = path5.node || {};
          if (key?.type !== "Identifier" || key.name !== "summary" || value?.type !== "Literal") {
            return;
          }
          if (!R5.isString(value.value)) return;
          this.stop();
          resolve(value.value);
        }
      });
    }
  });
  resolve(null);
});
var generateSummaryExport = async (node) => {
  const createMdxContent = await new Promise((resolve) => {
    if (!node) {
      resolve(null);
    }
    traverse2(node, {
      FunctionDeclaration(path4) {
        const { node: node2 } = path4;
        if (node2?.id.name !== "_createMdxContent") {
          return;
        }
        this.stop();
        resolve(node2.body);
      }
    });
    resolve(null);
  });
  const mdxContent = await new Promise((resolve) => {
    if (!node) {
      resolve(null);
    }
    traverse2(node, {
      FunctionDeclaration(path4) {
        const { node: node2 } = path4;
        if (node2?.id.name !== "MDXContent") {
          return;
        }
        this.stop();
        resolve(node2.body);
      }
    });
    resolve(null);
  });
  let expression;
  let body;
  if (!createMdxContent || !mdxContent) {
    expression = true;
    body = builders2.literal(null);
  } else {
    expression = false;
    body = builders2.blockStatement([
      builders2.variableDeclaration("const", [
        builders2.variableDeclarator(
          builders2.identifier("_createMdxContent"),
          builders2.arrowFunctionExpression(
            [builders2.identifier("props")],
            createMdxContent,
            true
          )
        )
      ]),
      builders2.returnStatement(
        builders2.arrowFunctionExpression(
          [
            builders2.assignmentPattern(
              builders2.identifier("props"),
              builders2.objectExpression([])
            )
          ],
          mdxContent,
          true
        )
      )
    ]);
  }
  return builders2.exportNamedDeclaration(
    builders2.variableDeclaration("const", [
      builders2.variableDeclarator(
        builders2.identifier("Summary"),
        builders2.arrowFunctionExpression([], body, expression)
      )
    ])
  );
};
var recmaSummary = () => async (tree, file, next) => {
  const summary = await findSummaryPropertyValue(tree);
  let Summary = await generateSummaryExport();
  if (summary && !R5.isEmpty(summary.trim())) {
    const tree2 = jsToTree(await mdxCompile(file, summary));
    Summary = await generateSummaryExport(tree2);
  }
  tree.body.push(Summary);
  next(void 0, tree);
};

// mdx/index.ts
var mdxOptions = {
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // 解析 markdown gfm 拓展语法
      remarkGfm,
      // 解析 frontmatter
      remarkFrontmatter,
      remarkExport
      // remarkCode,
    ],
    rehypePlugins: [
      rehypeImage
      /* , rehypeCode */
    ],
    recmaPlugins: [
      recmaContent,
      recmaSummary,
      // 将 src 引入本地图片转换为 import 引入本地图片
      recmaImportImages
      // recmaDebug,
    ]
  }
};
var mdxCompile = async (file, content) => {
  const { value } = await compile(
    { ...file, value: content },
    {
      development: true,
      rehypePlugins: [
        rehypeImage
        /* , rehypeCode */
      ],
      recmaPlugins: [
        // 将 src 引入本地图片转换为 import 引入本地图片
        recmaImportImages
      ]
    }
  );
  return value.toString();
};

// next.config.ts
var command = process.argv[2] || "dev";
var isProd = command !== "dev";
var isDev = command === "dev";
var isBundleAnalyze = R6.isTruthy(process.env.ANALYZE);
var nextConfig = {
  output: "export",
  basePath: getBasePath() === "/" ? "" : getBasePath(),
  pageExtensions: ["mdx", "md", "tsx", "ts", "jsx", "js"],
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    config.plugins.push(
      Unimport.webpack({
        dts: "./types/auto-imports.d.ts",
        presets: ["react"],
        imports: [
          { name: "default", as: "cx", from: "clsx" },
          { name: "*", as: "R", from: "remeda" }
        ]
      })
    );
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.env.DEV": isDev,
        "import.meta.env.PROD": isProd,
        "import.meta.env.SSR": `typeof window === "undefined"`
      })
    );
    config.infrastructureLogging = {
      level: "error"
    };
    return config;
  }
};
var withMDX = createMDX(mdxOptions);
var withBundleAnalyzer = createBundleAnalyzer({
  enabled: isProd && isBundleAnalyze
});
var next_config_default = withBundleAnalyzer(withMDX(nextConfig));
export {
  next_config_default as default
};
