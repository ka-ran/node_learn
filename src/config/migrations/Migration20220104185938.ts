import { Migration } from '@mikro-orm/migrations';

export class Migration20220104185938 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "test_post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

}
