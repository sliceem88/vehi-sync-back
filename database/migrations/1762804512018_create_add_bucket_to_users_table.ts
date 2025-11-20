import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddBucketToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('bucket')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('bucket')
    })
  }
}
