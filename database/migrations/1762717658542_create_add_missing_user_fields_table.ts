import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('full_name', 'name')
      table.string('surname').nullable()
      table.text('description').nullable()
      table.string('company_name').nullable()
      table
        .enu('type', ['operator', 'owner', 'service', 'mechanic'])
        .nullable()
        .after('company_name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('name', 'full_name')
      table.dropColumn('surname')
      table.dropColumn('description')
      table.dropColumn('company_name')
      table.dropColumn('type')
    })
  }
}
