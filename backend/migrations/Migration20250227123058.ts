import { Migration } from '@mikro-orm/migrations';

export class Migration20250227123058 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post" add column "ip_address" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post" drop column "ip_address";`);
  }

}
