import { Entity, Index, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export class User {
  @Index()
  @PrimaryKey()
  id!: bigint;

  @Index()
  @Unique()
  @Property()
  name!: string;

  @Property()
  ipAddresses!: string[];

  @Property({ hidden: true })
  passwordHash!: string;

  @Property({ type: "timestamp" })
  createdAt!: Date;
}
