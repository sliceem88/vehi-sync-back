import vine from '@vinejs/vine'
import { UserType } from '#enums/user_type'

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .toLowerCase()
      .trim()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()
        return !match
      }),
    password: vine.string().minLength(8),
    type: vine.enum(UserType)
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().toLowerCase().trim(),
    password: vine.string(),
  })
)
