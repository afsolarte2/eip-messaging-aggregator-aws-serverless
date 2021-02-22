'use strict';

const SQS = require('aws-sdk/clients/sqs');
const SNS = require('aws-sdk/clients/sns');

module.exports.handler = async event => {
  const sns = new SNS({
    region: 'us-east-1',
    apiVersion: '2010-03-31'
  })

  const sqs = new SQS({
    region: 'us-east-1',
    apiVersion: '2012-11-05'
  })

  const { Records } = event
  const { TOPIC_REPLY_B_ARN, QUEUE_REQUEST_B_LETTER_URL } = process.env

  for (const { body, receiptHandle } of Records) {
    const { uuid } = JSON.parse(body)
    const letter = 'B'

    console.log('uuid', uuid)
    console.log('letter', letter)

    const deduplicationId = `${uuid}-${Math.floor(new Date().getTime() / 1000.0)}`
    const messageBody = JSON.stringify({
      uuid,
      letter
    })

    try {
      const snsParams = {
        Message: messageBody,
        TopicArn: TOPIC_REPLY_B_ARN,
        MessageDeduplicationId: deduplicationId,
        MessageGroupId: 'Replier',
        MessageAttributes: {
          event: {
            DataType: 'String',
            StringValue: 'replyBLetter'
          }
        }
      };

      const publishTextPromise = await sns.publish(snsParams).promise()

      console.log(publishTextPromise)
    } catch (error) {
      console.error(error, error.stack);
    }

    try {
      const sqsParams = {
        QueueUrl: QUEUE_REQUEST_B_LETTER_URL,
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
