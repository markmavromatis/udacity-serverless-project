import * as AWS  from 'aws-sdk'

const bucketName = process.env.TODO_IMAGES_S3_BUCKET
const urlExpires = process.env.GENERATED_URL_EXPIRATION

export class FileLayerTodoAccess {
    
  getSignedUrl(todoId : string) {
    const s3 = new AWS.S3({signatureVersion: 'v4'})
  
    console.log("Generating URL for uploading image attachment to Todo: " + todoId)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  
    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: parseInt(urlExpires)
    })
    return url
  }
}