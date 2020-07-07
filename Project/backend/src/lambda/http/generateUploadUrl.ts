import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const bucketName = process.env.TODO_IMAGES_S3_BUCKET
const urlExpires = process.env.GENERATED_URL_EXPIRATION
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

  const todoId = event.pathParameters.todoId
  console.log("Generating URL for uploading image attachment to Todo: " + todoId)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpires)
  })

  const attachmentUrl: string = 'https://' + bucketName + '.s3.amazonaws.com/' + todoId
  const options = {
                TableName: todosTable,
                Key: {
                    todoId: todoId
                },
                UpdateExpression: "set attachmentUrl = :url",
                ExpressionAttributeValues: {
                    ":url": attachmentUrl
                },
                ReturnValues: "UPDATED_NEW"
            };
  await docClient.update(options).promise()
                

  return {
    statusCode: 200,
    body: JSON.stringify({"uploadUrl": url})
  }

})

handler
  .use(cors({credentials: true}))


