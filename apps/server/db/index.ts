import path from "path";

import { JSONFile, Low } from "@commonify/lowdb";
import { getBlogPath } from "share/utils";

import { Client } from "./client";

const filename = path.resolve(getBlogPath(), "db.json");
const adapter = new JSONFile<Db.Db>(filename);
const lowdb = new Low(adapter) as unknown as Db.LowDb<Db.Db>;

export const db = new Client(lowdb);
