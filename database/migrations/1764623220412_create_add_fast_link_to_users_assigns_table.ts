import { BaseSchema } from '@adonisjs/lucid/schema'
import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    const users = await User.all()
    for (const user of users) {
      user.fastLink = cuid()
      await user.save()
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.string('fast_link').notNullable().unique().alter()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
