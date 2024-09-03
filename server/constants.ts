import path from "node:path";

export const rootPath = process.cwd();

export const blogPath = path.resolve(rootPath, "blog");

export const blogConfigPath = path.resolve(blogPath, "config.json");

export const blogPagePath = path.resolve(blogPath, "pages");

export const blogComponentPath = path.resolve(blogPath, "components");

export const blogAssetPath = path.resolve(blogPath, "assets");

export const clientPath = path.resolve(rootPath, "src");

export const clientPagePath = path.resolve(clientPath, "app");

export const clientAssetPath = path.resolve(clientPath, "assets");

export const tempPath = path.resolve(rootPath, ".temp");

export const tempPagePath = path.resolve(tempPath, "pages");

export const tempComponentPath = path.resolve(tempPath, "components");

export const tempManifestPath = path.resolve(tempPath, "manifests");

export const tempMetadataPath = path.resolve(tempManifestPath, "metadata.json");

export const tempNavbarPath = path.resolve(tempManifestPath, "navbar.json");

export const tempBlogSchemaPath = path.resolve(tempPath, "blog/schema.json");

export const publicPath = path.resolve(rootPath, "public");

export const publicAssetPath = path.resolve(publicPath, "assets");

export const publicMdxPath = path.resolve(publicPath, "mdx");
