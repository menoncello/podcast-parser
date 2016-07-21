# Podcast Parser for NodeJS
Welcome to the Podcast Parser for NodeJS.

With this module, you can download a podcast feed to a object.

## Install

```bash
$ npm install podcast-parser --save
```

## How to use

```javascript
var podcastParser = require('podcast-parser');

// podcastParser.execute(url, options, callback)

podcastParser.execute(
  'http://feeds.serialpodcast.org/serialpodcast',
  {},
  function (err, res) {
		if (err) {
			console.log(err);
			return;
		}

		console.log(res);
	});

// podcastParser.download(url, callback)
podcastParser.download(
  'http://feeds.serialpodcast.org/serialpodcast',
  function (err, res) {
		if (err) {
			console.log(err);
			return;
		}

		console.log(res);
	});

// podcastParser.download(url, options, callback)
podcastParser.download(
  'http://feeds.serialpodcast.org/serialpodcast',
  { timeout: 60 },
  function (err, res) {
		if (err) {
			console.log(err);
			return;
		}

		console.log(res);
	});

// podcastParser.parse(xml, options, callback)
podcastParser.parse(
  '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>' +
  '<title>Nerdcast &#8211; Jovem Nerd</title><item><title>Nerdcast 514 ' +
  '&#8211; Turistas Babacas 2</title><enclosure' +
  ' url="https://jovemnerd.com.br/podpress_trac/feed/148003/0/nc514.mp3"' +
  ' length="73512785" type="audio/mpeg" /></item></rss>',
  {},
  function (err, res) {
		if (err) {
			console.log(err);
			return;
		}

		console.log(res);
	});
```

## Documentation

### `podcastParser.execute(url, options, callback)`
Given the feed url, returns the object representation of the feed

#### Params
- **String** 'url': The podcast's feed.
- **Object** 'options': The options passed to podcast parser method.
  - **String** 'dateAs': How will handle the dates (mainly the pubDate) (default: `string`)
    - `string`: return as `string`: `Fri, 29 Apr 2016 06:27:42 +0000`
    - `array`: return as `array`: `[ 2016, 3, 29, 6, 27, 42 ]`
    - `number`: return as `number`: `20160329062742`
    - `date`: return as `Date`: `new Date(2016, 3, 29, 6, 27, 42)`
  - **String** 'timeAs': How will handle the times (mainly the duration) (default: `string`)
    - `string`: return as `string`: `1:41:56`
    - `array`: return as `array`: `[ 1, 41, 56 ]`
    - `number`: return as `number`: `14156`
  - **number** 'timeout': will give timeout on waiting for the download. (default: `string`)
- **Function** 'callback': The callback function.

### `podcastParser.download(url, [options], callback)`
Download the feed from the URL

#### Params
- **String** 'url': The podcast's feed.
- **Object** 'options': The options passed to podcast parser method.
  - **number** 'timeout': will give timeout on waiting for the download. (default: `string`)
- **Function** 'callback': The callback function.

### `podcastParser.parse(xml, options, callback)`
Parse to a object, the representation of the feed

#### Params
- **String** 'xml': The podcast's feed xml.
- **Object** 'options': The options passed to podcast parser method.
  - **String** 'dateAs': How will handle the dates (mainly the pubDate) (default: `string`)
    - `string`: return as `string`: `Fri, 29 Apr 2016 06:27:42 +0000`
    - `array`: return as `array`: `[ 2016, 3, 29, 6, 27, 42 ]`
    - `number`: return as `number`: `20160329062742`
    - `date`: return as `Date`: `new Date(2016, 3, 29, 6, 27, 42)`
  - **String** 'timeAs': How will handle the times (mainly the duration) (default: `string`)
    - `string`: return as `string`: `1:41:56`
    - `array`: return as `array`: `[ 1, 41, 56 ]`
    - `number`: return as `number`: `14156`
- **Function** 'callback': The callback function.
