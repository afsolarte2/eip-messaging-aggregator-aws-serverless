'use strict';

const SQS = require('aws-sdk/clients/sqs');

module.exports.handler = async event => {
  const sqs = new SQS({
    region: 'us-east-1',
    apiVersion: '2012-11-05'
  })

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
