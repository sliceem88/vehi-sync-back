import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUserIdToVehicles extends BaseSchema {
  protected tableName = 'vehicles'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id')
    })
  }
}
