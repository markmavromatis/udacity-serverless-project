import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'

import { updateTodoUrl } from "../../businessLogic/todos"
import { createLogger } from '../../utils/logger'

const logger = createLogger("GenerateUploadUrl")

export const handler: SNSHandler = async (event: SNSEvent) => {

  logger.info(`Entering service UpdateImageUrl...`)

  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    logger.info('Processing S3 event', s3EventStr)
    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      logger.info(`Updating URL field for ToDo item: ${record}`)
      await updateUrl(record)
      logger.info(`Updated!`)
    }
  }
}

async function updateUrl(record: S3EventRecord) {
  const todoId = record.s3.object.key
  // Update URL field in database
  await updateTodoUrl(todoId)
}
