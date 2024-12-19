import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

import * as todoService from '../../service/todoService.js'
import { getUserId } from '../utils.mjs'
import { getUploadUrl } from '../../service/generateUploadUrlService.js'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('generateUploadUrlHandler')

const lambdaHandler = async (event) => {
  try {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const filename = JSON.parse(event.body).filename
    logger.info('Generating upload url', { userId, todoId, filename, event })
    const uploadUrl = await getUploadUrl(`${todoId}/${filename}`)

    // TODO : Adding logic to update attachment url here. This could be multiple calls from client UI
    const todoItem = await todoService.getTodo(userId, todoId)
    todoItem.attachmentUrl = uploadUrl.split('?')[0]
    logger.info('Updating todo item', { todoItem })
    await todoService.updateTodo(userId, todoItem)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (err) {
    logger.error('Error generating presigned url', {
      event: {
        body: event.body,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
        path: event.path
      },
      error: err
    })
    throw createError(
      500,
      JSON.stringify({
        error: 'Unable to generate upload url'
      })
    )
  }
}

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(lambdaHandler)
