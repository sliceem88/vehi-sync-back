import { BaseSchema } from '@adonisjs/lucid/schema'
import { randomUUID } from 'node:crypto'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('uuid').nullable()
    })

    const users = await this.db.from(this.tableName).select('id')
    for (const user of users) {
      await this.db.from(this.tableName).where('id', user.id).update({ uuid: randomUUID() })
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary()
      table.dropColumn('id')
      table.renameColumn('uuid', 'id')
      table.primary(['id'])
    })
  }

  async down() {
  }
}
