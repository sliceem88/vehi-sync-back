import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "jobs";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table
        .uuid("owner_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("vehicle_id")
        .unsigned()
        .references("id")
        .inTable("vehicles")
        .onDelete("CASCADE");
      table
        .uuid("service_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.date("job_date").notNullable();
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
