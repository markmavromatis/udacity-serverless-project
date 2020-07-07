import * as AWS from 'aws-sdk'
import {TodoItem} from "../models/TodoItem"
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const todoUserIdIndex = process.env.USER_ID_INDEX

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
}