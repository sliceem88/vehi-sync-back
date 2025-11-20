import vine from '@vinejs/vine'

export const createMerchantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    storeOwnerId: vine.number().positive(),
  })
)
