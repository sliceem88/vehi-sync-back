import Vehicle from '#models/vehicle'
import type { HttpContext } from '@adonisjs/core/http'
import { BucketService } from '#services/bucket_service'
import { inject } from '@adonisjs/core'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class VehiclesController {
  constructor(protected bucket: BucketService) {
  }

  public async create({ request, auth }: HttpContext) {
    const file = request.file('images');
    console.log('###', file);
    let fileName = '';

    const data = request.only([
      'name',
      'type',
      'year',
      'description',
      'images',
      'additionalInfo',
    ])

    if(file) {
      await file?.move('uploads')
      fileName = await this.bucket.uploadFile(auth.user!.bucket!, file?.filePath!)
    }

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
      return response.status(StatusCodes.NOT_FOUND).json({ message: 'Vehicle not found' })
    }

    return response.json(vehicle)
  }

  public async getAll({ auth, response }: HttpContext) {
    const vehicles = await Vehicle.findManyBy({ userId: auth.user!.id})

    if (!vehicles) {
      return response.status(StatusCodes.NOT_FOUND).json({ message: 'Vehicle not found' })
    }

    for (const vehicle of vehicles) {
      if(vehicle.images.fileName) {
        vehicle.images.fileName = await this.bucket.getSignedUrlForFile(vehicle.images.fileName)
      }
    }

    return response.json(vehicles)
  }

  public async delete({ params, response }: HttpContext) {
    const vehicle  = await Vehicle.find(params.id);

    if (!vehicle) {
      return response.status(StatusCodes.NOT_FOUND).json({ message: 'Vehicle not found' })
    }

    await vehicle.delete(); // Soft Delete

    return response.json(vehicle)  }
}
