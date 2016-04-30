'use strict';

let request = require('request');
let parseString = require('xml2js').parseString;

exports.execute = execute;
exports.download = download;
exports.parse = parse;

function execute(url, options, callback) {
  download(url, options, downloaded);

  function downloaded(err, data) {
    if (err) {
      callback(err);
      return;
    }

    parse(data, options, parsed);
  }

  function parsed(err, data) {
    if (err) {
      callback(err);
      return;
    }

    callback(data);
  }
}

function download(url, options, callback) {
  if (!url) {
    callback({ text: 'url is required' });
    return;
  }

  request(url, downloaded);

  function downloaded(err, response, body) {
    callback(null, body);
  }
}

function parse(xml, options, callback) {
  if (!xml) {
    callback({ text: 'xml can not be empty' });
    return;
  }

  parseString(xml, parsed);

  function parsed(err, res) {
    res = res.rss.$;
    callback(null, res);
  }
}
