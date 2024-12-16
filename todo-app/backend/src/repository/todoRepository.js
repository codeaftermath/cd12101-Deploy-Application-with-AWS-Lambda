import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  ScanCommand,
  PutCommand,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

export class TodoRepository {
  constructor(
    client = new DynamoDB(),
    todosTableName = process.env.TODOS_TABLE
  ) {
    this.client = client
    this.tableName = todosTableName
    this.docClient = DynamoDBDocumentClient.from(client)
  }

  async upsertTodo(item) {
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: item
    })
    await this.docClient.send(putCommand)
    return item
  }

  async getTodos() {
    const scanCommand = new ScanCommand({
      TableName: this.tableName
    })
    const result = await this.docClient.send(scanCommand)
    return result.Items
  }

  async deleteTodo(todoId) {
    const deleteCommand = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        todoId: todoId
      },
      ReturnValues: 'ALL_OLD'
    })
    const result = await this.docClient.send(deleteCommand)
    return result.Attributes
  }
}
