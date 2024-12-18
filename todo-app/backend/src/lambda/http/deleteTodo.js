import * as todoService from '../../service/todoService.js'

export async function handler(event) {
  console.log('Delete Event', event)
  const todoId = event.pathParameters.todoId
  const deletedItem = await todoService.deleteTodo(todoId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      deletedItem
    })
  }
}
