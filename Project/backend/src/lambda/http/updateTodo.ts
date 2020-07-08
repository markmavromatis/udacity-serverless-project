import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { updateTodo } from "../../businessLogic/todos"

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  console.log("Updating record: " + todoId)
  console.log("with fields: " + JSON.stringify(updatedTodo))

  updateTodo(todoId, updatedTodo)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
})

handler
  .use(cors({credentials: true}))

