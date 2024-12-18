import * as todoService from '../../service/todoService.js'
import { getUserId } from '../utils.mjs'

export async function handler(event) {
  const userId = getUserId(event)
  const result = await todoService.getAllTodos(userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: result
    })
  }
}
