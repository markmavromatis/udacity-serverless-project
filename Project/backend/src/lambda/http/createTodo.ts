import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {getUserIdFromAuthorizationHeader} from "../../auth/utils"
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'
import { createTodo } from "../../businessLogic/todos"

const logger = createLogger('auth')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info("Creating new TODO item: " + JSON.stringify(newTodo))

    // Retrieve User ID from Authorization header
    const userId = getUserIdFromAuthorizationHeader(event);

    logger.info("UserID: " + userId)
    const todoRequestFields : CreateTodoRequest = JSON.parse(event.body);

    logger.info("Creating new record in database...")
    const newItem = await createTodo(todoRequestFields, userId)
    logger.info("Record added!")

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
})

handler
  .use(cors({credentials: true}))
