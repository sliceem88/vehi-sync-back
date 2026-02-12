import { randomUUID } from "node:crypto";

import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
} from "@adonisjs/lucid/orm";
import * as relations from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

import { ServiceRequestStatus } from "#enums/service_request";
import User from "#models/user";
import Vehicle from "#models/vehicle";

export default class ServiceRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column({ columnName: "vehicle_id" })
  declare vehicleId: string | null;

  @column({ columnName: "service_id" })
  declare serviceId: string;

  @column({ columnName: "owner_id" })
  declare ownerId: string;

  @column()
  declare status: ServiceRequestStatus;

  @column()
  declare serviceComment: string | null;

  @column()
  declare ownerComment: string | null;

  @column()
  declare viewedByOwner: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => Vehicle, {
    foreignKey: "vehicleId",
  })
  declare vehicle: relations.BelongsTo<typeof Vehicle>;

  @belongsTo(() => User, {
    foreignKey: "serviceId",
  })
  declare service: relations.BelongsTo<typeof User>;

  @belongsTo(() => User, {
    foreignKey: "ownerId",
  })
  declare owner: relations.BelongsTo<typeof User>;

  @beforeCreate()
  static assignUuid(serviceRequest: ServiceRequest) {
    serviceRequest.id = randomUUID();
  }
}
