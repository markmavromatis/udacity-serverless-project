import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const toDoId = event.pathParameters.todoId
  const updatedToDo: UpdateTodoRequest = JSON.parse(event.body)
  console.log("Updating record: " + toDoId)
  console.log("with fields: " + JSON.stringify(updatedToDo))


  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await docClient.update({
    TableName: todosTable,
    Key:{
      "toDoId": toDoId
    },
    UpdateExpression: "set done=:done, dueDate=:dueDate, #n=:name",
    ExpressionAttributeValues:{
        ":done": updatedToDo.done,
        ":dueDate": updatedToDo.dueDate,
        ":name": updatedToDo.name
    },
    ExpressionAttributeNames: {"#n":"name"},
    ReturnValues:"UPDATED_NEW"
  }).promise()
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
}
