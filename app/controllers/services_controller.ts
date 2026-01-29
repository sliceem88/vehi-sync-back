import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { UserType } from '#enums/user_type'
import { inject } from '@adonisjs/core'
import ServiceRequest from '#models/service_request'
import { ServiceRequestStatus } from '#enums/service_request'

@inject()
export default class ServicesController {
  public async show({ response }: HttpContext) {
    const services = await User.findManyBy('type', UserType.SERVICE)

    return response.json(services)
  }

  public async serviceRequestRespond({ response, request }: HttpContext) {
    const serviceRequestId = request.param('serviceRequestId')
    const data = request.only(['status', 'comment'])

    const updatedServiceRequest = await ServiceRequest.query()
      .where({
        id: serviceRequestId,
      })
      .update({
        status: data.status,
        serviceComment: data.comment,
      })

    return response.json(updatedServiceRequest)
  }

  public async assignVehicleOwner({ response, request, auth }: HttpContext) {
    const serviceId = request.param('serviceId')
    const user = auth.user!

    await user.related('relatedUsers').attach([serviceId])

    return response.json(user)
  }

  public async getAssignedOrRequestedOwnerWithVehicle({ response, auth }: HttpContext) {
    const user = auth.user!

    const requestedServices = await ServiceRequest.query()
      .where({
        serviceId: user.id,
      })
      .preload('vehicle', (q) => {
        q.select(['id', 'name', 'type', 'images'])
      })
      .preload('owner', (q) => {
        q.select(['id', 'name', 'email', 'surname'])
      })

    return response.json(requestedServices)
  }

  public async deleteAssignedService({ response, request, auth }: HttpContext) {
    const user = auth.user!
    const serviceId = request.param('serviceId')
    const service = await User.find(serviceId)

    await user.related('relatedUsers').detach([serviceId])

    return response.json(service)
  }

  public async addMechanicToService({ response, request, auth }: HttpContext) {
    const user = auth.user!
    const data = request.only(['name', 'type', 'description', 'email'])
    const mechanic = await User.create({
      name: data.name,
      type: UserType.MECHANIC,
      description: data.description,
      email: data.email,
      // password: cuid(),
      password: data.email,
    })

    await user.related('relatedUsers').attach([mechanic.id])

    // TODO: notify mechanic by e-mail

    return response.json(mechanic)
  }

  public async getMechanics({ response, auth }: HttpContext) {
    const user = auth.user!

    const assignedServices = await user
      .related('relatedUsers')
      .query()
      .where('type', UserType.MECHANIC)

    return response.json(assignedServices)
  }

  public async getVehicleForJobs({ response, auth }: HttpContext) {
    const user = auth.user!
    const jobs = await ServiceRequest.query().where('serviceId', user.id).andWhere('status', ServiceRequestStatus.APPROVED)

    return response.json(jobs)
  }
}
