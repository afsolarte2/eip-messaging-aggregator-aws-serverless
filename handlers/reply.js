'use strict';

module.exports.handler = async event => {
  const { Records } = event

  Records
    .filter(record => record.eventName === 'MODIFY')
    .forEach(record => {
      console.log(JSON.stringify(record, null, 2))
    });
};
