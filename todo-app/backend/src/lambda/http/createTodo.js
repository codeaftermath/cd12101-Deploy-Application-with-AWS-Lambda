import * as todoService from '../../service/todoService.js'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodoHandler')

export async function handler(event) {
  const userId = getUserId(event)
  const newTodo = JSON.parse(event.body)
  logger.info('Creating todo', {
    userId,
    newTodo
  })
  const result = await todoService.createTodo(userId, newTodo)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: result
    })
  }
}
