import { Migration } from '@mikro-orm/migrations';

export class Migration20250318100931 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "invite" ("id" bigserial primary key, "code_hash" varchar(255) not null, "issuer_id" bigint not null, "is_expired" boolean not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "count" int not null);`);
    this.addSql(`create index "invite_id_index" on "invite" ("id");`);

    this.addSql(`create table "invite_used_by" ("invite_id" bigint not null, "user_id" bigint not null, constraint "invite_used_by_pkey" primary key ("invite_id", "user_id"));`);

    this.addSql(`alter table "invite" add constraint "invite_issuer_id_foreign" foreign key ("issuer_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "invite_used_by" add constraint "invite_used_by_invite_id_foreign" foreign key ("invite_id") references "invite" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "invite_used_by" add constraint "invite_used_by_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`create index "session_access_token_index" on "session" ("access_token");`);

    this.addSql(`create index "post_id_index" on "post" ("id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "invite_used_by" drop constraint "invite_used_by_invite_id_foreign";`);

    this.addSql(`drop table if exists "invite" cascade;`);

    this.addSql(`drop table if exists "invite_used_by" cascade;`);

    this.addSql(`drop index "session_access_token_index";`);

    this.addSql(`drop index "post_id_index";`);
  }

}
