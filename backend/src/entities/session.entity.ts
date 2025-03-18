import { Entity, Index, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Session {
  @PrimaryKey()
  id!: bigint;

  @ManyToOne()
  user!: User;

  @Index()
  @Property({ hidden: true })
  accessToken!: string;

  @Property({ hidden: true })
  csrfToken!: string;

  @Property()
  isDisposed!: boolean;

  @Property()
  createdAt!: Date;

  @Property()
  expiresAt!: Date;
}
