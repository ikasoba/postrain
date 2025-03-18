import { Migration } from '@mikro-orm/migrations';

export class Migration20250318111621 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post" add column "x" real not null default 0;`);
    this.addSql(`alter table "post" add column "y" real not null default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post" drop column "x";`);
    this.addSql(`alter table "post" drop column "y";`);
  }

}
