import { Entity, ManyToMany } from "typeorm";

import { Base } from "./Base";
import { Post } from "./Post";

import type { Relation } from "typeorm";

@Entity()
export class Category extends Base<Category> {
    @ManyToMany(() => Post, post => post.categories, { cascade: true })
    posts: Relation<Post>[];
}
