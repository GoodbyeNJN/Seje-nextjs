import { Column, Entity } from "typeorm";

import { Base } from "./Base";

@Entity()
export class Page extends Base<Page> {
    @Column({ unique: true })
    filePath: string;

    @Column()
    fileHash: string;

    @Column()
    contentHash: string;

    @Column()
    title: string;

    @Column("text")
    content: string;
}
