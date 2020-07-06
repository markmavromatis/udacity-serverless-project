import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'


const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
    body: JSON.stringify({})
  }
})

handler
  .use(cors({credentials: true}))

