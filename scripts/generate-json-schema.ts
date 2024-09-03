#!/usr/bin/env tsx

import { zodToJsonSchema } from "zod-to-json-schema";

import { schema } from "server/blog/schema";
import { tempBlogSchemaPath } from "server/constants";
import { safeWriteJson } from "utils/fs";

await safeWriteJson(tempBlogSchemaPath, zodToJsonSchema(schema, "Seje config schema"), 2);
