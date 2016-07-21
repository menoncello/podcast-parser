const fs = require('fs');

module.exports = requestNerdcast;

const xmlFile = fs.readFileSync('./tests/stubs/nerdcast-2016-04-29.xml');

function requestNerdcast(url, options, callback) {
  callback(null, xmlFile);
};
