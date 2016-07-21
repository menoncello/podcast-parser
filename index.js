'use strict';

const request = require('request');
const parseString = require('xml2js').parseString;
const dateHelper = require('./helpers/date-helper.js');
const _ = require('underscore');
const S = require('string');
const util = require('util');

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

	  parse(data.body || data, options, parsed);
  }

  function parsed(err, data) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, data);
  }
}

function download(url, options, callback) {
	if (util.isFunction(options)) {
		callback = options;
		options = {};
	}

	if (!url) {
    return callback({ text: 'url is required' });
  }

  options = options || {};

  let requestOptions = {
  	timeout: options.timeout || 30000
  };

  request(url, requestOptions, downloaded);

  function downloaded(err, body) {
  	if (err) {
  		return callback(err);
	  }

    callback(null, body);
  }
}

function parse(xml, options, callback) {
  if (!xml) {
    callback({ text: 'xml can not be empty' });
    return;
  }

  try {
    parseString(xml, parsed);
  } catch (ex) {
    parsed(ex);
  }

  function parsed(err, res) {
    if (err) {
      callback(err);
      return;
    }

    let result = {};
    try {
      let channel = _.compact(res.rss.channel);

      if (res.rss.$) {
        result.version = res.rss.$.version;
      }

      result.channel = {
        items: [],
      };

      if (channel.length > 0) {
        getField(channel[0], result.channel, 'title');
        getField(channel[0], result.channel, 'link');
        getField(channel[0], result.channel, 'description');
        getField(channel[0], result.channel, 'language');

        if (channel[0].item && channel[0].item.length > 0) {
          for (let i = 0; i < channel[0].item.length; i++) {
            let rssItem = channel[0].item[i];
            let item = {};

            getField(rssItem, item, 'title');
            getField(rssItem, item, 'link');
            getField(rssItem, item, 'description');
            getField(rssItem, item, 'duration', 'itunes:duration');
            getField(rssItem, item, 'subtitle', 'itunes:subtitle');
            getField(rssItem, item, 'summary', 'itunes:summary');
            getField(rssItem, item, 'content', 'content:encoded');
            getField(rssItem, item, 'pubDate');

            if (rssItem.enclosure && rssItem.enclosure.length > 0) {
              let enc = rssItem.enclosure[0].$;
              item.enclosure = {
                url: enc.url,
                length: parseInt(enc.length),
                type: enc.type,
              };
            }

            if (item.description) {
              item.description = S(item.description).unescapeHTML().s;
            }

            if (item.duration && options.timeAs === 'array') {
              item.duration = item.duration.split(':').map(x => parseInt(x));
            } else if (item.duration && options.timeAs === 'number') {
              let arr = item.duration.split(':').map(x => parseInt(x));
              let x = 1;
              let dur = 0;
              for (let i = arr.length - 1; i >= 0; i--) {
                dur += arr[i] * x;
                x *= 100;
              }

              item.duration = dur;
            }

            if (item.pubDate && options.dateAs === 'array') {
              item.pubDate = dateHelper.arrayDate(item.pubDate);
            } else if (item.pubDate && options.dateAs === 'number') {
              item.pubDate = dateHelper.numberDate(item.pubDate);
            } else if (item.pubDate && options.dateAs === 'date') {
              item.pubDate = dateHelper.date(item.pubDate);
            }

            result.channel.items.push(item);
          }

          // console.log(channel[0].item);
        }
      }
    } catch (ex) {
      ex.xml = xml;
      ex.url = options.url;
      callback(ex);
      return;
    }

    callback(null, result);
  }
}

function getField(origin, dest, prop, tag) {
  if (origin[tag ? tag : prop] && origin[tag ? tag : prop].length > 0) {
    dest[prop] = origin[tag ? tag : prop][0];
  }
}
