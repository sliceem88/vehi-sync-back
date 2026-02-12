import { BaseSchema } from "@adonisjs/lucid/schema";

export default class ServiceRequests extends BaseSchema {
  protected tableName = "service_requests";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table
        .uuid("service_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("vehicle_id")
        .notNullable()
        .references("id")
        .inTable("vehicles")
        .onDelete("CASCADE");

      table
        .boolean("approved_by_service")
        .notNullable()
        .defaultTo(false)
        .comment("Indicates if the service approved the request");

      table
        .string("service_comment")
        .nullable()
        .comment("Service comment when declined or approved");

      table
        .boolean("viewed_by_owner")
        .notNullable()
        .defaultTo(false)
        .comment("Indicates whether the owner has viewed the service response");

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
