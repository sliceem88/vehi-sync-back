import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { randomUUID } from 'node:crypto'
import Vehicle from '#models/vehicle'

export default class Job extends SoftDeletes(BaseModel) {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'vehicle_id' })
  declare vehicleId: string

  @column({ columnName: 'service_id' })
  declare serviceId: string

  @column({ columnName: 'owner_id' })
  declare ownerId: string

  @column.date()
  declare jobDate: DateTime

  @column()
  declare status: string

  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>

  @belongsTo(() => Vehicle)
  declare vehicle: BelongsTo<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(job: Job) {
    job.id = randomUUID()
  }
}
