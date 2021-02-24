'use strict';

const AWS = require('../services/aws')

module.exports.handler = async event => {
  const { Records } = event
  const constantProperties = 2

  const aggregators = {
    requestLetter: 2
  }

  Records
    .filter(record => record.eventName === 'MODIFY')
    .forEach(record => {
      const { dynamodb: { NewImage } } = record
      const unmarshalledRecord = AWS.dynamoDbConverter().unmarshall(NewImage)
      const propertiesNumber = Object.keys(unmarshalledRecord).length
      const aggregatorIsComplete = (propertiesNumber - constantProperties) === aggregators.requestLetter

      if(aggregatorIsComplete) {
        // Send message
      }
    });
};
