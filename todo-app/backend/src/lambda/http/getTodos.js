import * as todoService from '../../service/todoService.js'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('getTodoHandler')

export async function handler(event) {
  const userId = getUserId(event)
  logger.info('Fetching todos', { userId })
  const result = await todoService.getAllTodos(userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: result
    })
  }
}
