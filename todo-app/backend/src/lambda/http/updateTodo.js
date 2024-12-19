import * as todoService from '../../service/todoService.js'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodoHandler')

export async function handler(event) {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo = {
    todoId,
    ...JSON.parse(event.body)
  }
  logger.info('Creating todo', {
    userId,
    updatedTodo
  })
  const result = await todoService.updateTodo(userId, updatedTodo)
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
