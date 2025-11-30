import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { UserType } from '#enums/user_type'

@inject()
export default class OwnersController {
  public async show({ response, auth}: HttpContext) {
    const user = auth.user!
    const assignedOwners =
      await user.related('relatedTo').query().where('type', UserType.OWNER)

    return response.json(assignedOwners)
  }
}
