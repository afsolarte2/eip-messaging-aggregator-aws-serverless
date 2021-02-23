const SQS = require('aws-sdk/clients/sqs')
const SNS = require('aws-sdk/clients/sns')
const DynamoDb = require('aws-sdk/clients/dynamodb')

class AWS {
  static sqs = () => {
    return new SQS({
      region: 'us-east-1',
      apiVersion: '2012-11-05'
    })
  }

  static sns = () => {
    return new SNS({
      region: 'us-east-1',
      apiVersion: '2010-03-31'
    })
  }

  static dynamoDbDocumentClient = () => {
    return new DynamoDb.DocumentClient({
      region: 'us-east-1'
    })
  }
}

module.exports = AWS
