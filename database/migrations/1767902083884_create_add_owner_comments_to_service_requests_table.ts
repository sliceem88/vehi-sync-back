import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "service_requests";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string("owner_comment")
        .nullable()
        .comment("Owner comment - additional info");
    });
  }

  async down() {}
}
