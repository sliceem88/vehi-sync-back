import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Job from '#models/job'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { randomUUID } from 'node:crypto'

export default class Task extends SoftDeletes(BaseModel) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare jobId: string

  @column({ columnName: 'mechanic_id' })
  declare mechanicId: string

  @column()
  declare description: string | null

  @column()
  declare status: string

  @belongsTo(() => Job)
  declare job: BelongsTo<typeof Job>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(task: Task) {
    task.id = randomUUID()
  }
}
