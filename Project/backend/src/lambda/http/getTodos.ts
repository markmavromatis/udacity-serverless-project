import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import {parseUserId} from "../../auth/utils"
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const todoUserIdIndex = process.env.USER_ID_INDEX

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log(JSON.stringify(event))

  // Retrieve User ID
  const authorization = event.headers.Authorization
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);

  console.log("User ID: " + userId)
  
  // Query DynamoDB for Todos belonging to this user
  const result = await docClient.query({
    TableName : todosTable,
    IndexName : todoUserIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
        ':userId': userId
    }
  }).promise()

  console.log("Result items = " + JSON.stringify(result.Items))
  const returnResult = result.Items ? result.Items : [];

  // Return results (if there are any).
  return {
    statusCode: 200,
    body: JSON.stringify({items: returnResult})
  }

  // UI complains if I return a 404. So I return a 0-element array if there are no records.
  // return {
  //   statusCode: 404,
  //   body: ''
  // }

})

handler
  .use(cors({credentials: true}))

