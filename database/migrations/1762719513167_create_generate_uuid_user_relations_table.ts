import { BaseSchema } from "@adonisjs/lucid/schema";

export default class CreateUserRelationsTable extends BaseSchema {
  protected tableName = "user_relations";

  public async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("related_user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
      table.unique(["user_id", "related_user_id"]);
    });

    await this.db.raw(
      `ALTER TABLE ${this.tableName} ALTER COLUMN id SET DEFAULT gen_random_uuid()`,
    );
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
