import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { ScanCommand, PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export class TodoRepository {
  constructor(
    client = new DynamoDB(),
    todosTableName = process.env.TODOS_TABLE
  ) {
    this.client = client
    this.tableName = todosTableName
    this.docClient = DynamoDBDocumentClient.from(client)
  }

  async createTodo(newItem) {
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: newItem
    })
    await this.docClient.send(putCommand)
  }

  async getTodos() {
    const scanCommand = new ScanCommand({
      TableName: this.tableName
    })
    const result = await this.docClient.send(scanCommand)
    return result.Items
  }
}
