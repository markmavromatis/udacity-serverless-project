import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { FileLayerTodoAccess } from '../fileStorageLayer/fileStorageTodoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()
const fileLayerAccess = new FileLayerTodoAccess()

// Business logic for creating a Todo item
export async function createTodo(
  todoRequest: CreateTodoRequest,
  userId: string): Promise<TodoItem> {

  const itemId = uuid.v4()
  const newTodo : TodoItem = {
      todoId: itemId,
      userId: userId,
      name: todoRequest.name,
      createdAt: new Date().toISOString(),
      dueDate: todoRequest.dueDate,
      done: false
  }
  return await todoAccess.createTodo(newTodo)
}

export async function getToDos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getToDos(userId)
}

export async function deleteToDo(todoId: string) {
  await todoAccess.deleteToDo(todoId)
}

// Business logic for updating a Todo item
export async function updateTodo(todoId: string, todoRequest: UpdateTodoRequest) {
  await todoAccess.updateToDo(todoId, todoRequest.name, todoRequest.dueDate, todoRequest.done)
}

// Ask File storage service for a temporary URL
export async function generateUploadUrl(todoId: string) {
  return await fileLayerAccess.getSignedUrl(todoId)
}

// Update URL field in the Todos table
export async function updateTodoUrl(todoId: string) {
  await todoAccess.updateUrl(todoId)

}