import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '#start/env'
import * as fs from 'node:fs'
import {unlink}  from "fs/promises"
import { cuid } from '@adonisjs/core/helpers'

export const LOCAL_UPLOAD_DIR = 'uploads';

export class BucketService {
  private readonly s3Client: S3Client
  private bucketName: string = 'vehiSyncBucket'

  constructor() {
    const endpoint = env.get('BUCKET_ENDPOINT')
    const region = env.get('BUCKET_REGION')
    const keyId = env.get('BUCKET_KEY_ID')
    const appKey = env.get('BUCKET_APPLICATION_KEY')

    if (!endpoint || !region || !keyId || !appKey) {
      throw new Error('Missing required Backblaze B2 environment variables')
    }

    this.s3Client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId: keyId,
        secretAccessKey: appKey,
      },
    })
  }

  /**
   * List all files in the bucket
   */
  async listFiles(prefix?: string, maxKeys: number = 1000) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: env.get('BUCKET_APPLICATION_KEY_NAME'),
        Prefix: prefix,
        MaxKeys: maxKeys,
      })

      const response = await this.s3Client.send(command)

      return {
        files: response.Contents?.map((file) => ({
          key: file.Key,
          size: file.Size,
          lastModified: file.LastModified,
          etag: file.ETag,
        })) || [],
        isTruncated: response.IsTruncated,
        nextContinuationToken: response.NextContinuationToken,
      }
    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  }

  /**
   * List all files with pagination support
   */
  async listAllFiles(prefix?: string) {
    const allFiles: any[] = []
    let continuationToken: string | undefined

    try {
      do {
        const command = new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })

        const response = await this.s3Client.send(command)

        if (response.Contents) {
          allFiles.push(
            ...response.Contents.map((file) => ({
              key: file.Key,
              size: file.Size,
              lastModified: file.LastModified,
              etag: file.ETag,
            }))
          )
        }

        continuationToken = response.NextContinuationToken
      } while (continuationToken)

      return allFiles
    } catch (error) {
      console.error('Error listing all files:', error)
      throw error
    }
  }

  createFilaPathName(bucket: string) {
    const randomName = `${cuid()}.jpeg`;
    const outputName = `${LOCAL_UPLOAD_DIR}/${randomName}`;
    const bucketName = `${bucket}/${randomName}`;

    return {
      outputName,
      bucketName,
    };
  }

  /**
   * Upload a file to the bucket
   */
  async uploadFile(fileName: string, filePath: string) {
    const fileStream = fs.createReadStream(filePath);

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileStream,
      })

      await this.s3Client.send(command)
      await unlink(filePath)
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Get a file from the bucket
   */
  async getFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      const response = await this.s3Client.send(command)
      return response
    } catch (error) {
      console.error('Error getting file:', error)
      throw error
    }
  }

  async getSignedUrlForFile(fileKey: string) {
    return await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      }),
      { expiresIn: 360 } // 1 hour
    );
  }

  /**
   * Delete a file from the bucket
   */
  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      const response = await this.s3Client.send(command)
      return response
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }

  /**
   * Generate a presigned URL for temporary file access
   */
  async getPresignedUrl(key: string, expiresIn: number = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      const url = await getSignedUrl(this.s3Client, command, { expiresIn })
      return url
    } catch (error) {
      console.error('Error generating presigned URL:', error)
      throw error
    }
  }
}
