import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { UserType } from '#enums/user_type'
import ServiceRequest from '#models/service_request'

@inject()
export default class OwnersController {
  public async show({ response, auth }: HttpContext) {
    const user = auth.user!
    const assignedOwners = await user.related('relatedTo').query().where('type', UserType.OWNER)

    return response.json(assignedOwners)
  }

  public async getAssignedOrRequestedServiceWithVehicle({ response, auth }: HttpContext) {
    const user = auth.user!

    const requestedServices = await ServiceRequest.query()
      .where({
        ownerId: user.id,
      })
      .preload('vehicle', (q) => {
        q.select(['id', 'name', 'type', 'images'])
      })
      .preload('service', (q) => {
        q.select(['id', 'name', 'companyName', 'email', 'description'])
      })

    return response.json(requestedServices)
  }
}
