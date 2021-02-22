'use strict'

module.exports.handler = async event => {
  console.log(event)

  const { Records } = event

  for (const { body, receiptHandle } of Records) {
    console.log(body, receiptHandle)
  }

  //   Request Syntax
  //   {
  //     "Records": [
  //        {
  //           "Data": blob,
  //           "ExplicitHashKey": "string",
  //           "PartitionKey": "string"
  //        }
  //     ],
  //     "StreamName": "string"
  //  }

  // kinesis.putRecord(params, function (err, data) {
  //   if (err) console.log(err, err.stack)
  //   // an error occurred
  //   else console.log(data) // successful response
  // })

  //   Response Syntax
  //   {
  //     "EncryptionType": "string",
  //     "FailedRecordCount": number,
  //     "Records": [
  //        {
  //           "ErrorCode": "string",
  //           "ErrorMessage": "string",
  //           "SequenceNumber": "string",
  //           "ShardId": "string"
  //        }
  //     ]
  //  }

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
