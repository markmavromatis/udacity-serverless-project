import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { generateUploadUrl } from "../../businessLogic/todos"

import { createLogger } from '../../utils/logger'

const logger = createLogger("GenerateUploadUrl")

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const requestId = event.requestContext.requestId

  logger.info(`${requestId} Entering GenerateUploadUrl service...`)

  const todoId = event.pathParameters.todoId

  logger.info(`${requestId} Generating URL for Todo with ID: ${todoId}`)

  const url = await generateUploadUrl(todoId);

  logger.info(`${requestId} Retrieved temporary URL: ${url}`)

  logger.info("${requestId} Exiting with status code 200...")

  return {
    statusCode: 200,
    body: JSON.stringify({"uploadUrl": url})
  }

})

handler
  .use(cors({credentials: true}))


