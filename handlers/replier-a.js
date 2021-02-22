'use strict';

const AWS = require('../services/aws')

module.exports.handler = async event => {
  const sns = AWS.sns()
  const sqs = AWS.sqs()

  const { Records } = event
  const { TOPIC_REPLY_A_ARN, QUEUE_REQUEST_A_LETTER_URL } = process.env

  for (const { body, receiptHandle } of Records) {
    const { uuid } = JSON.parse(body)
    const letter = 'A'

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
        TopicArn: TOPIC_REPLY_A_ARN,
        MessageDeduplicationId: deduplicationId,
        MessageGroupId: 'Replier',
        MessageAttributes: {
          event: {
            DataType: 'String',
            StringValue: 'replyALetter'
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
        QueueUrl: QUEUE_REQUEST_A_LETTER_URL,
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
