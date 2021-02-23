'use strict'

const moment = require('moment')
const AWS = require('../services/aws')

module.exports.handler = async event => {
  const { Records } = event
  const sqs = AWS.sqs()

  for (const { receiptHandle, body, attributes, eventSourceARN } of Records) {
    const { uuid, letter } = JSON.parse(body)
    const { MessageGroupId } = attributes

    await store(uuid, MessageGroupId, letter)

    try {
      const [, , , region, accountId, queueName] = eventSourceARN.split(':')

      const sqsParams = {
        QueueUrl: `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`,
        ReceiptHandle: receiptHandle
      }

      await sqs.deleteMessage(sqsParams).promise()
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

const store = async (uuid, part, response) => {
  const { AGGREGATOR_TABLE_NAME } = process.env
  const documentClient = AWS.dynamoDbDocumentClient()

  const params = {
    TableName: AGGREGATOR_TABLE_NAME,
    Key: { uuid },
    UpdateExpression: `set #part = :part, #timeToLive = :timeToLive`,
    ExpressionAttributeNames: {
      '#part': part,
      '#timeToLive': 'timeToLive'
    },
    ExpressionAttributeValues: {
      ':part': response,
      ':timeToLive': moment().add(1, 'day').unix()
    }
  }

  await documentClient.update(params).promise()
}
