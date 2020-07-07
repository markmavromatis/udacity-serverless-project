import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import {parseUserId} from "../../auth/utils"
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // Retrieve User ID
  const authorization = event.headers.Authorization
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
  
  const todoId = uuid.v4()

  const newItem = {
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    ...newTodo
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
})

handler
  .use(cors({credentials: true}))
