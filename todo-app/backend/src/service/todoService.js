import * as uuid from 'uuid'
import { TodoRepository } from '../repository/todoRepository.js'

const todoRepository = new TodoRepository()

export async function createTodo(newItem) {
  const todoId = uuid.v4()
  const todoItem = {
    todoId,
    createdAt: new Date().toISOString(),
    attachmentUrl: '',
    ...newItem
  }
  await todoRepository.createTodo(todoItem)
  return todoItem
}

export async function getAllTodos() {
  return todoRepository.getTodos()
}
