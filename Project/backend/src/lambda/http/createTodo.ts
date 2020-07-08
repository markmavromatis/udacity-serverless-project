import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {getUserIdFromAuthorizationHeader} from "../../auth/utils"
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'
import { createTodo } from "../../businessLogic/todos"

const logger = createLogger("CreateToDo")

// This service creates a new Todo item
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const requestId = event.requestContext.requestId

    logger.info(`${requestId} Entering CreateToDo service...`)

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info(`${requestId} Creating new TODO item: ${JSON.stringify(newTodo)}`)

    // Retrieve User ID from Authorization header
    const userId = getUserIdFromAuthorizationHeader(event);

    logger.info(`${requestId} UserID: ${userId}`)
    const todoRequestFields : CreateTodoRequest = JSON.parse(event.body);

    logger.info(`${requestId} Creating new record in database...`)
    const newItem = await createTodo(todoRequestFields, userId)
    logger.info(`${requestId} Record added!`)

    logger.info(`${requestId} Exiting with status code 201...`)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
})

handler
  .use(cors({credentials: true}))
