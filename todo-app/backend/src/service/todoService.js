import * as uuid from 'uuid'
import { TodoRepository } from '../repository/todoRepository.js'

const todoRepository = new TodoRepository()

export async function createTodo(newItem) {
  const todoId = uuid.v4()
  const todoItem = {
    todoId,
    createdAt: new Date().toISOString(),
    dueDate: '',
    done: false,
    attachmentUrl: '',
    ...newItem
  }
  return todoRepository.upsertTodo(todoItem)
}

export async function getAllTodos(userId) {
  return todoRepository.getTodos(userId)
}

export async function updateTodo(updatedTodo) {
  const todoItem = {
    attachmentUrl: '',
    ...updatedTodo
  }
  return todoRepository.upsertTodo(todoItem)
}

export async function deleteTodo(todoId) {
  return todoRepository.deleteTodo(todoId)
}
