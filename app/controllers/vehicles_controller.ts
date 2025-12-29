import Vehicle from '#models/vehicle'
import type { HttpContext } from '@adonisjs/core/http'
import { BucketService, LOCAL_UPLOAD_DIR } from '#services/bucket_service'
import { inject } from '@adonisjs/core'
import { StatusCodes } from 'http-status-codes'
import { OptimizeService } from '#services/optimize_service'

@inject()
export default class VehiclesController {
  constructor(
    protected bucket: BucketService,
    protected optimizeService: OptimizeService
  ) {}

  public async create({ request, auth }: HttpContext) {
    const file = request.file('images')
    const user = auth.user!
    let fileName = ''

    const data = request.only(['name', 'type', 'year', 'description', 'images', 'additionalInfo'])

    if (file) {
      await file.move(LOCAL_UPLOAD_DIR)
      const { outputName, bucketName } = this.bucket.createFilaPathName(user.bucket!)
      await this.optimizeService.compressImage(file?.filePath!, outputName)
      await this.bucket.uploadFile(bucketName, outputName)
      fileName = bucketName
    }

    return await Vehicle.create({
      name: data.name,
      type: data.type,
      year: data.year,
      description: data.description,
      images: { fileName: fileName },
      additionalInfo: data.additionalInfo,
      userId: user.id,
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
    const vehicles = await Vehicle.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', 'desc')

    if (!vehicles) {
      return response.status(StatusCodes.NOT_FOUND).json({ message: 'Vehicle not found' })
    }

    for (const vehicle of vehicles) {
      if (vehicle.images.fileName) {
        vehicle.images.fileName = await this.bucket.getSignedUrlForFile(vehicle.images.fileName)
      }
    }

    return response.json(vehicles)
  }

  public async delete({ params, response }: HttpContext) {
    const vehicle = await Vehicle.find(params.id)

    if (!vehicle) {
      return response.status(StatusCodes.NOT_FOUND).json({ message: 'Vehicle not found' })
    }

    await vehicle.delete() // Soft Delete

    return response.json(vehicle)
  }

  public async update({ request, response }: HttpContext) {
    const vehicle = await Vehicle.find(request.param('id'))

    if (!vehicle) {
      return response.status(StatusCodes.NOT_FOUND).json({ message: 'Vehicle not found' })
    }

    const updateData = request.only([
      'name',
      'type',
      'year',
      'description',
      'images',
      'additionalInfo',
    ])

    vehicle.merge(updateData)
    await vehicle.save()

    return response.json(await vehicle.refresh())
  }
}
