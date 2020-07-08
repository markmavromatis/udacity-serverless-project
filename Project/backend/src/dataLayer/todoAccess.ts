import * as AWS from 'aws-sdk'
import {TodoItem} from "../models/TodoItem"
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const todoUserIdIndex = process.env.USER_ID_INDEX
const bucketName = process.env.TODO_IMAGES_S3_BUCKET

// DynamoDb logic for Todos App operations

// DynamoDb logic for creating
export class TodoAccess {

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()
  
    return todo
  }

  async getToDos(userId: string): Promise<TodoItem[]> {
    const result = await docClient.query({
        TableName : todosTable,
        IndexName : todoUserIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    console.log("Result items = " + JSON.stringify(result.Items))
    return result.Items ? result.Items as TodoItem[]: [] as TodoItem[];
  }

  async deleteToDo(todoId: string) {
    await docClient.delete({
      TableName: todosTable,
      Key:{
        "todoId": todoId
      }
    }).promise()
  }

  async updateToDo(todoId : string, name : string, dueDate : string, done : boolean) {
    await docClient.update({
      TableName: todosTable,
      Key:{
        "todoId": todoId
      },
      UpdateExpression: "set done=:done, dueDate=:dueDate, #n=:name",
      ExpressionAttributeValues:{
          ":done": done,
          ":dueDate": dueDate,
          ":name": name
      },
      ExpressionAttributeNames: {"#n":"name"},
      ReturnValues:"UPDATED_NEW"
    }).promise()
  }

  // Update the url field in the DynamoDB Todos table
  async updateUrl(todoId : String) {

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
  }

}