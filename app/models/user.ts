import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose, cuid } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { UserType } from '#enums/user_type'
import { randomUUID } from 'node:crypto'
import * as relations from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string | null

  @column()
  declare surname: string | null

  @column()
  declare description: string | null

  @column()
  declare companyName: string | null

  @column()
  declare type: UserType | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => User, {
    pivotTable: 'user_relations',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'related_user_id',
  })
  declare relatedUsers: relations.ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'user_relations',
    localKey: 'id',
    pivotForeignKey: 'related_user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare relatedTo: relations.ManyToMany<typeof User>

  @column()
  declare bucket: string | null

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  @beforeCreate()
  static assignBucket(user: User) {
    if (user.type === UserType.OWNER) {
      user.bucket = cuid()
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
