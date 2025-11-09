import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  static disableTransactions = true
  protected tableName = 'auth_access_tokens'

  async up() {
    const hasColumn = await this.hasColumn(this.tableName, 'tokenable_id')
    if (hasColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('tokenable_id')
      })
    }

    this.schema.alterTable(this.tableName, (table) => {
      table
        .uuid('tokenable_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  async down() {
    const hasColumn = await this.hasColumn(this.tableName, 'tokenable_id')
    if (hasColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('tokenable_id')
      })
    }

    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('tokenable_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  private async hasColumn(table: string, column: string) {
    const result = await this.db.rawQuery(
      `SELECT 1 FROM information_schema.columns WHERE table_name = ? AND column_name = ? LIMIT 1`,
      [table, column]
    )
    return result.rows.length > 0
  }
}
