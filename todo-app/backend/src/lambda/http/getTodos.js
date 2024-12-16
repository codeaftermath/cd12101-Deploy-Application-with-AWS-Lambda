import * as todoService from '../../service/todoService.js'

export async function handler(event) {
  const result = await todoService.getAllTodos()
  return {
    statusCode: 201,
    body: JSON.stringify({
      items: result
    })
  }
}
