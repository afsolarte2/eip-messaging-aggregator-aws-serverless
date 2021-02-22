'use strict';

const SNS = require('aws-sdk/clients/sns');
const { v4: uuidv4 } = require('uuid');

module.exports.handler = async event => {
  const sns = new SNS({
    region: 'us-east-1',
    apiVersion: '2010-03-31'
  })

  const messagesToSend = 1

  const { TOPIC_REQUEST_ARN } = process.env

  /**
   * Entrada
   * -> {uuid: 'abc-123'}
   *
   * Salidas Individuales
   * <- {uuid: 'abc-123', letter: 'A'}
   * <- {uuid: 'abc-123', letter: 'B'}
   *
   * Salida después del agregador
   * <- {uuid: 'abc-123', letters: ['A', 'B']}
  */

  for (let index = 0; index < messagesToSend; index++) {
    const uuid = uuidv4()
    const deduplicationId = `${uuid}-${Math.floor(new Date().getTime() / 1000.0)}`
    const message = JSON.stringify({uuid})

    const params = {
      Message: message,
      TopicArn: TOPIC_REQUEST_ARN,
      MessageDeduplicationId: deduplicationId,
      MessageGroupId: 'Requester',
      MessageAttributes: {
        event: {
          DataType: 'String',
          StringValue: 'requestLetter'
        }
      }
    }

    try {
      const publishTextPromise = await sns.publish(params).promise();

      console.log(publishTextPromise)
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
