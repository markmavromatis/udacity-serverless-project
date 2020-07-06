import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS  from 'aws-sdk'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const toDoId = event.pathParameters.todoId
  console.log("Deleting record: " + toDoId)

  // TODO: Remove a TODO item by id
  await docClient.delete({
    TableName: todosTable,
    Key:{
      "toDoId": toDoId
    }
  }).promise()
  
  return {
    statusCode: 200,
    body: JSON.stringify({})
  }

})

handler
  .use(cors({credentials: true}))

