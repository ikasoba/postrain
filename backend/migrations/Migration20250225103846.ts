import { Migration } from '@mikro-orm/migrations';

export class Migration20250225103846 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" bigserial primary key, "name" varchar(255) not null, "ip_addresses" text[] not null, "password_hash" varchar(255) not null, "created_at" timestamptz not null);`);

    this.addSql(`create table "session" ("id" bigserial primary key, "user_id" bigint not null, "is_disposed" boolean not null, "created_at" timestamptz not null, "expires_at" timestamptz not null);`);

    this.addSql(`create table "post" ("id" bigserial primary key, "content" varchar(1024) not null, "author_id" bigint null, "created_at" timestamptz not null);`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete set null;`);
  }

}
