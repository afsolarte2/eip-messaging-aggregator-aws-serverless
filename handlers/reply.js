'use strict';

const AWS = require('../services/aws')

module.exports.handler = async event => {
  const sqs = AWS.sqs()

  const { Records } = event
  const { QUEUE_REPLY_LETTER_URL } = process.env

  for (const { body, receiptHandle } of Records) {
    const { uuid, result } = JSON.parse(body)

    console.log('uuid', uuid)
    console.log('result', result)

    try {
      const sqsParams = {
        QueueUrl: QUEUE_REPLY_LETTER_URL,
        ReceiptHandle: receiptHandle
      }

      const deleteSqsMessagePromise = await sqs.deleteMessage(sqsParams).promise()

      console.log(deleteSqsMessagePromise)
    } catch (error) {
      console.error(error, error.stack);
    }
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
  };
};
