import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ServiceRequest from '#models/service_request'
import { ServiceRequestStatus } from '#enums/service_request'

// Controller to assign Vehicle Owner to Service
@inject()
export default class ServicesRequestController {
  public async makeAssignRequest({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const serviceId = request.param('serviceId');

    await ServiceRequest.create({
      ownerId: user.id,
      serviceId,
      status: ServiceRequestStatus.PENDING,
      viewedByOwner: false,
    })

    return response.json({
      data: serviceId,
    })
  }
}
