import { BucketService } from '#services/bucket_service'
import { inject } from '@adonisjs/core'

@inject()
export class BucketController {
  constructor(protected bucket: BucketService) {
  }

  async index() {
    const files = await this.bucket.listFiles()
    return files
  }

  async all() {
    const allFiles = await this.bucket.listAllFiles()
    return allFiles
  }
}
