import AWSXRay from 'aws-xray-sdk-core'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('generateUploadUrlService')

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3Client = new S3Client()
const s3XRayClient = AWSXRay.captureAWSv3Client(s3Client)

export const getUploadUrl = async (imageId) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })
  const url = await getSignedUrl(s3XRayClient, command, {
    expiresIn: urlExpiration
  })
  logger.info('Generated signed url', { imageId, url })
  return url
}
