import { Collection, Entity, Index, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Invite {
  @Index()
  @PrimaryKey()
  id!: bigint;

  @Property({ hidden: true })
  codeHash!: string;

  @ManyToOne()
  issuer!: User;

  @ManyToMany()
  usedBy!: Collection<User>;

  @Property()
  isExpired!: boolean;

  @Property({ type: "timestamp" })
  expiresAt!: Date;

  @Property({ type: "timestamp" })
  createdAt!: Date;

  @Property({ type: "integer" })
  count!: number;
}
