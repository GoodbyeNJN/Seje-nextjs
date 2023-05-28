import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

import { Base } from "./Base";
import { Category } from "./Category";
import { Tag } from "./Tag";

import type { Relation } from "typeorm";

@Entity()
export class Post extends Base<Post> {
    @Column({ unique: true })
    filePath: string;

    @Column()
    fileHash: string;

    @Column()
    contentHash: string;

    @Column()
    title: string;

    @Column("date")
    date: Date;

    @Column()
    year: number;

    @Column()
    month: number;

    @Column("text")
    excerpt: string;

    @Column("text")
    content: string;

    @ManyToMany(() => Category, category => category.posts, { cascade: true })
    @JoinTable()
    categories: Relation<Category>[];

    @ManyToMany(() => Tag, tag => tag.posts, { cascade: true })
    @JoinTable()
    tags: Relation<Tag>[];
}
