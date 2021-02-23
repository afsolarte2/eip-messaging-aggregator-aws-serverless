'use strict'

const AWS = require('../services/aws')

module.exports.handler = async event => {
  const kinesis = AWS.kinesis()

  const { KINESIS_STREAM_NAME } = process.env
  const { Records } = event

  console.log(event)

  for (const { body, receiptHandle } of Records) {
    const { uuid, letter } = JSON.parse(body)

    var params = {
      Data: JSON.stringify({ uuid, letter }),
      ExplicitHashKey: '12345',
      PartitionKey: uuid,
      StreamName: KINESIS_STREAM_NAME
    }

    try {
      const kinesisResult = await kinesis.putRecords(params).promise()

      console.log(kinesisResult)
    } catch (error) {
      console.error(error)
    }

    /*try {
      const sqsParams = {
        QueueUrl: QUEUE_REPLY_LETTER_URL,
        ReceiptHandle: receiptHandle
      }

      const deleteSqsMessagePromise = await sqs.deleteMessage(sqsParams).promise()

      console.log(deleteSqsMessagePromise)
    } catch (error) {
      console.error(error, error.stack);
    }*/
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  }
}
