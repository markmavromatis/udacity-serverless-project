import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { getUserIdFromAuthorizationHeader } from '../auth/utils'

const todoAccess = new TodoAccess()

// export async function getAllGroups(): Promise<TodoItem[]> {
//   return todoAccess.getTodos()
// }

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
