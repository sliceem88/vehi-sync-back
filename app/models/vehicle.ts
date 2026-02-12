import { randomUUID } from "node:crypto";

import { compose } from "@adonisjs/core/helpers";
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
} from "@adonisjs/lucid/orm";
import * as relations from "@adonisjs/lucid/types/relations";
import { SoftDeletes } from "adonis-lucid-soft-deletes";
import { DateTime } from "luxon";

import User from "#models/user";

export default class Vehicle extends compose(BaseModel, SoftDeletes) {
  public static table = "vehicles";

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare type: string;

  @column.dateTime()
  declare year: DateTime | null;

  @column()
  declare description: string;

  @column()
  declare images: any;

  @column()
  declare additionalInfo: any;

  @column()
  declare userId: string;

  @belongsTo(() => User)
  declare user: relations.BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime({ columnName: "deleted_at" })
  declare deletedAt: DateTime | null;

  @beforeCreate()
  static assignUuid(vehicle: Vehicle) {
    vehicle.id = randomUUID();
  }
}
