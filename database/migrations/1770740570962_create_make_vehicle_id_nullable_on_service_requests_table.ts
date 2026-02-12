import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "service_requests";

  async up() {
    await this.schema.alterTable(this.tableName, (table) => {
      table.uuid("vehicle_id").nullable().alter();
    });
  }

  async down() {
    await this.schema.alterTable(this.tableName, (table) => {
      table.uuid("vehicle_id").notNullable().alter();
    });
  }
}
