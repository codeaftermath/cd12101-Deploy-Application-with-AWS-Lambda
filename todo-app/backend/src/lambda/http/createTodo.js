import * as todoService from '../../service/todoService.js'

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  const result = await todoService.createTodo(newTodo)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: result
    })
  }
}
