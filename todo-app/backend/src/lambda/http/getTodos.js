import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

import * as todoService from '../../service/todoService.js'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('getTodoHandler')

const lambdaHandler = async (event) => {
  try {
    const userId = getUserId(event)
    logger.info('Fetching todos', { userId })

    const result = await todoService.getAllTodos(userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        items: result
      })
    }
  } catch (err) {
    logger.error('Error Getting Todo(s)', {
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
        error: 'Server error getting todo(s)'
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
