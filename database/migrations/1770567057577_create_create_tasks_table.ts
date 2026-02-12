import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "tasks";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.uuid("job_id").references("id").inTable("jobs").onDelete("CASCADE");
      table
        .uuid("mechanic_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table.text("description").nullable();
      table.string("status").notNullable().defaultTo("new");

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
