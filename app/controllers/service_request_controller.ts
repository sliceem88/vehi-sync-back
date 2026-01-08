import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ServiceRequest from '#models/service_request'
import { ServiceRequestStatus } from '#enums/service_request'

// Controller to assign Vehicle Owner to Service
@inject()
export default class ServicesRequestController {
  public async makeAssignRequest({ request, response }: HttpContext) {
    const serviceId = request.param('serviceId');
    const { vehicleId, comments } = request.only(['vehicleId', 'comments'])
    // const comments = request.param('comments')

    await ServiceRequest.create({
      vehicleId,
      serviceId,
      status: ServiceRequestStatus.PENDING,
      viewedByOwner: false,
      ownerComment: comments,
    })

    return response.json({
      data: serviceId,
    })
  }
}
