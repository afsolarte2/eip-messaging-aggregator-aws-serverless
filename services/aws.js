const SQS = require('aws-sdk/clients/sqs')
const SNS = require('aws-sdk/clients/sns')
const Kinesis = require('aws-sdk/clients/kinesis')

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

  static kinesis = () => {
    return new Kinesis({
      region: 'us-east-1',
      apiVersion: '2013-12-02'
    })
  }
}

module.exports = AWS
