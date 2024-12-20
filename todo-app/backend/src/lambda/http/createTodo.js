import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

import * as todoService from '../../service/todoService.js'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { timeInMillis, sendLatencyMetric } from '../../utils/metrics.mjs'

const NAMESPACE = process.env.NAMESPACE
const SERVICE_NAME = 'CREATE_TODO_HANDLER'

const logger = createLogger(SERVICE_NAME)

const lambdaHandler = async (event) => {
  const start = timeInMillis()
  try {
    const userId = getUserId(event)
    const newTodo = JSON.parse(event.body)
    logger.info('Creating todo', {
      userId,
      newTodo
    })

    const result = await todoService.createTodo(userId, newTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: result
      })
    }
  } catch (err) {
    logger.error('Error Creating Todo', {
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
        error: 'Server error creating todo'
      })
    )
  } finally {
    const end = timeInMillis()
    const totalTimeInMillis = end - start
    await sendLatencyMetric(NAMESPACE, SERVICE_NAME, totalTimeInMillis)
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
