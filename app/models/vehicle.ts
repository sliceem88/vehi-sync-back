import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Vehicle extends BaseModel {
  public static table = 'vehicles'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare year: number

  @column()
  declare description: string

  @column()
  declare images: any

  @column()
  declare additionalInfo: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(vehicle: Vehicle) {
    vehicle.id = randomUUID()
  }
}
