import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { UserType } from '#enums/user_type'
import { inject } from '@adonisjs/core'

@inject()
export default class ServicesController {
  public async show({ response }: HttpContext) {
    const services = await User.findManyBy('type', UserType.SERVICE);

    return response.json(services);
  }
}
