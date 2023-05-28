import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Base<T> extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column({ unique: true, default: "" })
    pathname: string; // 不带前缀的路径

    @Column({ unique: true, default: "" })
    permalink: string; // 带前缀的路径

    constructor(data?: Partial<T>) {
        super();
        data && this.assign(data);
    }

    assign(data: Partial<T>) {
        Object.assign(this, data);
    }
}
