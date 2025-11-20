import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class ConstantController {
  async index(ctx: HttpContext) {
    const accountTypes = [
      { key: 'operator', label: 'Operator' },
      { key: 'owner', label: 'Vehicle Owner' },
      { key: 'service', label: 'Service Owner' },
      { key: 'mechanic', label: 'Mechanic' },
    ]

    return ctx.response.json(accountTypes)
  }
}
