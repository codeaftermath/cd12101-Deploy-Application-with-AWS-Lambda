import * as todoService from '../../service/todoService.js'

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  const result = await todoService.createTodo(newTodo)
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
