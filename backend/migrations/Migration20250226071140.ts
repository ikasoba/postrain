import { Migration } from '@mikro-orm/migrations';

export class Migration20250226071140 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "session" add column "access_token" varchar(255) not null, add column "csrf_token" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "session" drop column "access_token", drop column "csrf_token";`);
  }

}
