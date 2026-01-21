import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ServiceRequest from '#models/service_request'
import { ServiceRequestStatus } from '#enums/service_request'

// Controller to assign Vehicle Owner to Service
@inject()
export default class ServicesRequestController {

  // TODO: make validation
  public async makeAssignRequest({ request, response, auth }: HttpContext) {
    const serviceId = request.param('serviceId');
    const owner = auth.user!
    const { vehicleId, comments } = request.only(['vehicleId', 'comments'])

    await ServiceRequest.create({
      vehicleId,
      serviceId,
      status: ServiceRequestStatus.PENDING,
      viewedByOwner: false,
      ownerComment: comments,
      ownerId: owner.id,
    })

    return response.json({
      data: serviceId,
    })
  }
}
