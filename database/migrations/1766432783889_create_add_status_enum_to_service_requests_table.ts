import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ReplaceApprovedWithStatusString extends BaseSchema {
  protected tableName = 'service_requests'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('status')
        .notNullable()
        .defaultTo('pending')
        .comment('pending | approved | declined')

      table.dropColumn('approved_by_service')

      table.unique(['owner_id', 'service_id', 'status'], {
        indexName: 'service_requests_owner_service_status_unique',
      })
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(
        ['owner_id', 'service_id', 'status'],
        'service_requests_owner_service_status_unique'
      )

      table.dropColumn('status')
      table.boolean('approved_by_service').notNullable().defaultTo(false)
    })
  }
}
