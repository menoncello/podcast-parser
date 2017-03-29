const Promise = require('bluebird-tools');
const request = require('request');
const parseString = Promise.promisify(require('xml2js').parseString);
const dateHelper = require('./helpers/date-helper.js');
const _ = require('underscore');
const S = require('string');
const util = require('util');

exports.execute = execute;
exports.download = download;
exports.parse = parse;

function execute(url, options, callback) {
  download(url, options)
	  .then(data => parse(data.body || data, options))
	  .then(res => callback(null, res))
	  .catch(callback);
}

function download(url, options, callback) {
	if (util.isFunction(options)) {
		callback = options;
		options = {};
	}

	if (!url) {
		const error = { message: 'url is required' };
		if (callback) {
			callback(error);
		}
    return Promise.reject(error);
  }

  options = options || {};

  let requestOptions = {
  	timeout: options.timeout || 30000
  };

  return new Promise((resolve, reject) => request(url, requestOptions, (e, r, b) => {
  	if (e) {
  		reject(e);
	  } else {
  		resolve(b || r);
	  }
  }))
	  .then(res => callback(null, res))
	  .catch(callback);
}

function parse(xml, options, callback) {
  if (!xml) {
  	const error = { message: 'xml can not be empty' };
    callback(error);
    return Promise.reject(error);
  }

  return parseString(xml)
	  .then(res => process(options, res))
	  .catch(callback)
	  .then(res => callback(null, res));
}

function getField(origin, dest, prop, tag) {
  if (origin[tag ? tag : prop] && origin[tag ? tag : prop].length > 0) {
    dest[prop] = origin[tag ? tag : prop][0];
  }
}

function process(options, res) {
	return new Promise((resolve, reject) => {
		const result = {};

		try {
			const channel = _.compact(res.rss.channel);

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

				try {
					const imageUrl = channel[0]['itunes:image'].pop().$.href;
					if (imageUrl && imageUrl.length > 2) {
						result.channel.image = imageUrl;
					} else {
						result.channel.image = null;
					}
				} catch (ex) {
					result.channel.image = null;
				}

				if (channel[0].item && channel[0].item.length > 0) {
					for (let i = 0; i < channel[0].item.length; i++) {
						const rssItem = channel[0].item[i];
						const item = {};

						getField(rssItem, item, 'title');
						getField(rssItem, item, 'link');
						getField(rssItem, item, 'description');
						getField(rssItem, item, 'duration', 'itunes:duration');
						getField(rssItem, item, 'subtitle', 'itunes:subtitle');
						getField(rssItem, item, 'summary', 'itunes:summary');
						getField(rssItem, item, 'content', 'content:encoded');
						getField(rssItem, item, 'pubDate');

						if (rssItem.enclosure && rssItem.enclosure.length > 0) {
							const enc = rssItem.enclosure[0].$;
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
							const arr = item.duration.split(':').map(x => parseInt(x));
							let x = 1;
							let dur = 0;
							for (const item of arr) {
								dur += item * x;
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

				}
			}

		} catch (ex) {
			ex.url = options.url;
			reject(ex);
			return;
		}

		resolve(result);
	});
}
