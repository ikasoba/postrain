import { Entity, Index, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Post {
  @Index()
  @PrimaryKey()
  id!: bigint;

  @Property({ type: "varchar", length: 1024 })
  content!: string;

  @ManyToOne()
  author?: User;

  @Property({ hidden: true })
  ipAddress!: string;

  @Property({ type: "timestamp" })
  createdAt!: Date;

  @Property({ type: "float", default: 0 })
  x!: number;
  
  @Property({ type: "float", default: 0 })
  y!: number;
}
