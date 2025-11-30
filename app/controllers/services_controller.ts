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

  public async assignVehicleOwner({ response, request, auth }: HttpContext) {
    const serviceId = request.param('serviceId');
    const user = auth.user!

    await user.related('relatedUsers').attach([serviceId]);

    return response.json(user);
  }

  public async getAssignedServices({ response, auth }: HttpContext) {
    const user = auth.user!

    const assignedServices =
      await user.related('relatedUsers').query().where('type', UserType.SERVICE)

    return response.json(assignedServices);
  }

  public async deleteAssignedService ({ response, request, auth }: HttpContext) {
    const user = auth.user!
    const serviceId = request.param('serviceId');
    const service = await User.find(serviceId)

    await user.related('relatedUsers').detach([serviceId]);

    return response.json(service);
  }

  public async addMechanicToService ({ response, request, auth }: HttpContext) {
    const user = auth.user!
    const data = request.only([
      'name',
      'type',
      'description',
      'email',
    ])
    const mechanic = await User.create({
      name: data.name,
      type: UserType.MECHANIC,
      description: data.description,
      email: data.email,
      // password: cuid(),
      password: data.email,
    })

    await user.related('relatedUsers').attach([mechanic.id]);

    // TODO: notify mechanic by e-mail

    return response.json(mechanic);
  }

  public async getMechanics({ response, auth }: HttpContext) {
    const user = auth.user!

    const assignedServices =
      await user.related('relatedUsers').query().where('type', UserType.MECHANIC)

    return response.json(assignedServices);
  }
}
