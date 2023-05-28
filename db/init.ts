import "reflect-metadata";
import { DataSource } from "typeorm";

import { Category, Page, Post, Tag } from "./entity";

export const db = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    synchronize: true,
    logging: false,
    entities: [Category, Page, Post, Tag],
    migrations: [],
    subscribers: [],
});
