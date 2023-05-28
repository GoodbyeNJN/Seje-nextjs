import { Entity, ManyToMany } from "typeorm";

import { Base } from "./Base";
import { Post } from "./Post";

import type { Relation } from "typeorm";

@Entity()
export class Tag extends Base<Tag> {
    @ManyToMany(() => Post, post => post.tags, { cascade: true })
    posts: Relation<Post>[];
}
