import { BaseSchema } from "@adonisjs/lucid/schema";

export default class ChangeYearToDatetimeInVehicles extends BaseSchema {
  protected tableName = "vehicles";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("year");
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp("year", { useTz: true });
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("year");
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger("year");
    });
  }
}
