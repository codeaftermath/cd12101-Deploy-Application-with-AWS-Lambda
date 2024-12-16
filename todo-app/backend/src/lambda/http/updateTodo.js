import * as todoService from '../../service/todoService.js'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = {
    todoId,
    ...JSON.parse(event.body)
  }
  const result = await todoService.updateTodo(updatedTodo)
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
