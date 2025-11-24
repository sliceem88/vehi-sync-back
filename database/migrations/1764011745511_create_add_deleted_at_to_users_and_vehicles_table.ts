import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableNameUsers = 'users'
  protected tableNameVehicles = 'vehicles'

  async up() {
    this.schema.alterTable(this.tableNameUsers, (table) => {
      table.timestamp('deleted_at').nullable()
    })

    this.schema.alterTable(this.tableNameVehicles, (table) => {
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableNameUsers, (table) => {
      table.dropColumn('deleted_at')
    })

    this.schema.alterTable(this.tableNameVehicles, (table) => {
      table.dropColumn('deleted_at')
    })
  }
}
