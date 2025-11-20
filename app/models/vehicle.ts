import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Vehicle extends BaseModel {
  public static table = 'vehicles'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column.dateTime()
  declare year: DateTime | null

  @column()
  declare description: string

  @column()
  declare images: any

  @column()
  declare additionalInfo: any

  @column()
  declare userId: string

  @belongsTo(() => User)
  declare user: relations.BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(vehicle: Vehicle) {
    vehicle.id = randomUUID()
  }
}
