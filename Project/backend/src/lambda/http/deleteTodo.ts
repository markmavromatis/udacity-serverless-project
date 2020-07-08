import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteToDo } from "../../businessLogic/todos"
import { createLogger } from '../../utils/logger'

const logger = createLogger("DeleteToDo")

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const requestId = event.requestContext.requestId

  logger.info(`${requestId} Entering DeleteToDo service...`)

  const todoId = event.pathParameters.todoId
  logger.info(`${requestId} Deleting ToDo record: ${todoId}`)

  await deleteToDo(todoId)

  logger.info(`${requestId} Exiting with status code 200...`)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }

})

handler
  .use(cors({credentials: true}))

