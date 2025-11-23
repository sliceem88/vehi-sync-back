import Vehicle from '#models/vehicle'
import type { HttpContext } from '@adonisjs/core/http'
import { BucketService } from '#services/bucket_service'
import { inject } from '@adonisjs/core'

@inject()
export default class VehiclesController {
  constructor(protected bucket: BucketService) {
  }

  public async create({ request, auth }: HttpContext) {
    const file = request.file('images');
    await file?.move('uploads')
    const data = request.only([
      'name',
      'type',
      'year',
      'description',
      'images',
      'additionalInfo',
    ])

    const fileName = await this.bucket.uploadFile(auth.user!.bucket!, file!.filePath!)
    return await Vehicle.create({
      name: data.name,
      type: data.type,
      year: data.year,
      description: data.description,
      images: {fileName: fileName},
      additionalInfo: data.additionalInfo,
      userId: auth.user!.id
    })
  }

  public async show({ params, response }: HttpContext) {
    const vehicle = await Vehicle.find(params.id)

    if (!vehicle) {
      return response.status(404).json({ message: 'Vehicle not found' })
    }

    return response.json(vehicle)
  }

  public async getAll({ auth, response }: HttpContext) {
    const vehicles = await Vehicle.findManyBy({ userId: auth.user!.id})

    if (!vehicles) {
      return response.status(404).json({ message: 'Vehicle not found' })
    }

    for (const vehicle of vehicles) {
      vehicle.images.fileName = await this.bucket.getSignedUrlForFile(vehicle.images.fileName)
    }

    return response.json(vehicles)
  }
}
