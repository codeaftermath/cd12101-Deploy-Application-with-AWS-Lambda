import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  GetCommand,
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoRepository')
export class TodoRepository {
  constructor(
    client = new DynamoDB(),
    todosTableName = process.env.TODOS_TABLE
  ) {
    this.client = client
    this.xRayClient = AWSXRay.captureAWSv3Client(this.client)
    this.tableName = todosTableName
    this.docClient = DynamoDBDocumentClient.from(this.xRayClient)
  }

  async upsertTodo(userId, todo) {
    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: {
        userId,
        ...todo
      }
    })
    logger.info('Updating todo item', {
      tableName: this.tableName,
      user: userId,
      todoId: todo.todoId
    })
    logger.info('Upserting todo item', {
      tableName: this.tableName,
      user: userId,
      ...todo
    })
    await this.docClient.send(putCommand)
    logger.info('Upserted todo item', {
      tableName: this.tableName,
      user: userId,
      todoId: todo.todoId
    })
    return todo
  }

  async getTodo(userId, todoId) {
    const input = {
      Key: {
        userId,
        todoId
      },
      TableName: this.tableName
    }
    const command = new GetCommand(input)
    const result = await this.docClient.send(command)
    logger.info('Get Todo Item', {
      tableName: this.tableName,
      userId,
      found: !!result.Item
    })
    return result.Item
  }

  async getTodos(userId) {
    const input = {
      ExpressionAttributeValues: {
        ':userId': userId
      },
      KeyConditionExpression: 'userId = :userId',
      TableName: this.tableName,
      ConsistentRead: true
    }
    const command = new QueryCommand(input)
    const result = await this.docClient.send(command)
    logger.info('Todo Query Result count', {
      tableName: this.tableName,
      userId,
      count: result.Items.length
    })
    return result.Items
  }

  async deleteTodo(userId, todoId) {
    const deleteCommand = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        userId,
        todoId
      },
      ReturnValues: 'ALL_OLD'
    })
    logger.info('Deleting Todo', {
      tableName: this.tableName,
      userId,
      todoId
    })
    const result = await this.docClient.send(deleteCommand)
    logger.info('Deleted Todo', {
      tableName: this.tableName,
      user: userId,
      todoId
    })
    return result.Attributes
  }
}
