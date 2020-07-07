import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'


const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  console.log("Updating record: " + todoId)
  console.log("with fields: " + JSON.stringify(updatedTodo))


  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await docClient.update({
    TableName: todosTable,
    Key:{
      "todoId": todoId
    },
    UpdateExpression: "set done=:done, dueDate=:dueDate, #n=:name",
    ExpressionAttributeValues:{
        ":done": updatedTodo.done,
        ":dueDate": updatedTodo.dueDate,
        ":name": updatedTodo.name
    },
    ExpressionAttributeNames: {"#n":"name"},
    ReturnValues:"UPDATED_NEW"
  }).promise()
  
  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
})

handler
  .use(cors({credentials: true}))

