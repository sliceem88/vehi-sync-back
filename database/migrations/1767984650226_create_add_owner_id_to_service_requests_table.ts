import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "service_requests";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid("owner_id").notNullable().references("id").inTable("users");
    });
  }

  async down() {}
}
