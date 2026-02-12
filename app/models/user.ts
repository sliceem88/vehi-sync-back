import { randomUUID } from "node:crypto";

import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose, cuid } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import {
  BaseModel,
  beforeCreate,
  column,
  hasMany,
  manyToMany,
} from "@adonisjs/lucid/orm";
import * as relations from "@adonisjs/lucid/types/relations";
import { SoftDeletes } from "adonis-lucid-soft-deletes";
import { DateTime } from "luxon";

import { UserType } from "#enums/user_type";
import Task from "#models/task";
import Vehicle from "#models/vehicle";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
  uids: ["email"],
  passwordColumnName: "password",
});

export default class User extends compose(BaseModel, AuthFinder, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string | null;

  @column()
  declare surname: string | null;

  @column()
  declare description: string | null;

  @column()
  declare companyName: string | null;

  @column()
  declare type: UserType | null;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @manyToMany(() => User, {
    pivotTable: "user_relations",
    localKey: "id",
    pivotForeignKey: "user_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "related_user_id",
  })
  declare relatedUsers: relations.ManyToMany<typeof User>;

  @manyToMany(() => User, {
    pivotTable: "user_relations",
    localKey: "id",
    pivotForeignKey: "related_user_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "user_id",
  })
  declare relatedTo: relations.ManyToMany<typeof User>;

  @hasMany(() => Task, {
    foreignKey: "mechanicId",
  })
  declare mechanicTasks: relations.HasMany<typeof Task>;

  @hasMany(() => Vehicle, {
    foreignKey: "userId",
  })
  declare vehicles: relations.HasMany<typeof Vehicle>;

  @column()
  declare bucket: string | null;

  @column.dateTime({ columnName: "deleted_at" })
  declare deletedAt: DateTime | null;

  @column()
  declare fastLink: string;

  @column({ columnName: "created_by_service" })
  declare createdByService: boolean;

  @beforeCreate()
  static assignFastLink(user: User) {
    user.fastLink = cuid();
  }

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID();
  }

  @beforeCreate()
  static assignBucket(user: User) {
    if (user.type === UserType.OWNER) {
      user.bucket = cuid();
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User);
}
