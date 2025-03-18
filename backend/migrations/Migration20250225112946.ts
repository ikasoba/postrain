import { Migration } from '@mikro-orm/migrations';

export class Migration20250225112946 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create index "user_id_index" on "user" ("id");`);
    this.addSql(`create index "user_name_index" on "user" ("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "user_id_index";`);
    this.addSql(`drop index "user_name_index";`);
  }

}
