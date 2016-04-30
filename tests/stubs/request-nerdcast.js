let fs = require('fs');

module.exports = requestNerdcast;

let xmlFile = fs.readFileSync('./tests/stubs/nerdcast-2016-04-29.xml');

function requestNerdcast(url, callback) {
  callback(null, {}, xmlFile);
};
