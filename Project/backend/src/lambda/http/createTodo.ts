import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import {parseUserId} from "../../auth/utils"

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const toDosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newToDo: CreateTodoRequest = JSON.parse(event.body)

  // Retrieve User ID
  const authorization = event.headers.Authorization
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
  
  const toDoId = uuid.v4()

  const newItem = {
    toDoId: toDoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    ...newToDo
  }

  await docClient.put({
    TableName: toDosTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
