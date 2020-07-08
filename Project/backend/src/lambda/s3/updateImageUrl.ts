import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'

import { updateTodoUrl } from "../../businessLogic/todos"

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log('Processing SNS event ', JSON.stringify(event))
  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    console.log('Processing S3 event', s3EventStr)
    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      await updateUrl(record)
    }
  }
}

async function updateUrl(record: S3EventRecord) {
  const todoId = record.s3.object.key
  console.log("Updating URL for record: " + todoId)
  // Update URL field in database
  await updateTodoUrl(todoId)
  console.log("Update complete!")
}
