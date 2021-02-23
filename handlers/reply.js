'use strict';

module.exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2))

  const { Records } = event

  for (const { kinesis } of Records) {
    const { data } = kinesis

    console.log('base 64 data', data)

    var decoded = Buffer.from(data, 'base64').toString('utf-8');

    console.log('decoded data', decoded)
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
