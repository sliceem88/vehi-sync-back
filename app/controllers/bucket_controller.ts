import { inject } from "@adonisjs/core";

import { ExceptionCode } from "#exceptions/exception_code";
import { BucketService } from "#services/bucket_service";
import { ResponseApi } from "#utilities/api_response";

@inject()
export class BucketController {
  constructor(protected bucket: BucketService) {}

  async index() {
    try {
      const files = await this.bucket.listFiles();

      return ResponseApi.success(files);
    } catch (error) {
      return ResponseApi.error(error, ExceptionCode.BUCKET_LIST_FILE);
    }
  }

  async all() {
    try {
      const allFiles = await this.bucket.listAllFiles();

      return ResponseApi.success(allFiles);
    } catch (error) {
      return ResponseApi.error(error, ExceptionCode.BUCKET_LIST_ALL_FILE);
    }
  }
}
