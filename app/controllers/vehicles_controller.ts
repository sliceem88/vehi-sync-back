import Vehicle from '#models/vehicle'
import type { HttpContext } from '@adonisjs/core/http'


export default class VehiclesController {
  /**
   * Create Vehicle
   */
  public async create({ request }: HttpContext) {
    const data = request.only([
      'name',
      'type',
      'year',
      'description',
      'images',
      'additional_info',
    ])

    const vehicle = await Vehicle.create({
      name: data.name,
      type: data.type,
      year: data.year,
      description: data.description,
      images: data.images,
      additionalInfo: data.additional_info,
    })

    return vehicle
  }

  /**
   * Get Vehicle By ID
   */
  public async show({ params, response }: HttpContext) {
    const vehicle = await Vehicle.find(params.id)

    if (!vehicle) {
      return response.status(404).json({ message: 'Vehicle not found' })
    }

    return vehicle
  }
}
