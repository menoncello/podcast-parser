'use strict';

const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');
const mockery = require('mockery');

const after = require("mocha").after;
const afterEach = require("mocha").afterEach;
const beforeEach = require("mocha").beforeEach;
const before = require("mocha").before;
const describe = require("mocha").describe;
const it = require("mocha").it;

const sandbox = sinon.sandbox.create();
const request = function (url, callback) {
    callback();
  };

let podcastParser;

describe('parse', function () {

  before(function () {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true,
      });
    });

  beforeEach(function () {
      mockery.registerMock('request', request);
      mockery.registerAllowable('../index.js');
      mockery.registerAllowable('string');
      mockery.registerAllowable('xml2js');
      mockery.registerAllowable('querystring');
      podcastParser = require('../index.js');
    });

  afterEach(function () {
      sandbox.verifyAndRestore();
      mockery.resetCache();
      mockery.deregisterAll();
    });

  after(function () {
      mockery.disable();
    });

  it('should return error if data is empty', function (done) {
    podcastParser.parse('', {}, function (err) {
        should.exist(err);
        done();
      });
  });

  it('should return existing object when passing a xml only with the rss',
    function (done) {
      const xml = '<?xml version="1.0" encoding="UTF-8"?><rss></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        should.exist(data);
        done();
      });
    });

  it('should return version \'2.0\' when passing a xml only with the rss',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.version.should.equal('2.0');
        done();
      });
    });

  it('should channel exists when passing a channel element in the feed',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        should.exist(data.channel);
        done();
      });
    });

  it('should channel be a object when passing a channel element in the feed',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel>' +
        '</channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.should.be.a('object');
        done();
      });
    });

  it('should return existing items when passing a xml only with the rss',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        should.exist(data.channel.items);
        done();
      });
    });

  it('should return existing items when passing a xml only with the rss',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items.should.be.a('array');
        done();
      });
    });

  it('should title equals to \'Nerdcast – Jovem Nerd\' when passing the title element',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel>' +
        '<title>Nerdcast &#8211; Jovem Nerd</title></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.title.should.equal('Nerdcast – Jovem Nerd');
        done();
      });
    });

  it('should link equals to \'https://jovemnerd.com.br\' when passing the link element',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel>' +
        '<link>https://jovemnerd.com.br</link></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.link.should.equal('https://jovemnerd.com.br');
        done();
      });
    });

  it('should description equals to \'O mundo pop vira piada no Jovem Nerd\' when passing ' +
      'the description element',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel>' +
        '<description>O mundo pop vira piada no Jovem Nerd</description></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.description.should.equal('O mundo pop vira piada no Jovem Nerd');
        done();
      });
    });

  it('should language equals to \'pt-BR\' when passing the language element',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel>' +
        '<language>pt-BR</language></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.language.should.equal('pt-BR');
        done();
      });
    });

  it('should items have 3 items when passing 3 tags',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel>' +
        '<item></item><item></item><item></item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items.length.should.equal(3);
        done();
      });
    });

  it('should the first item have the title \'Nerdcast 514 – Turistas Babacas 2\' ' +
    'when the title tag',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<title>Nerdcast 514 &#8211; Turistas Babacas 2</title></item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].title.should.equal('Nerdcast 514 – Turistas Babacas 2');
        done();
      });
    });

  it('should the first item have the link ' +
    '\'https://jovemnerd.com.br/nerdcast/nerdcast-514-turistas-babacas-2/\' when the link tag',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<link>https://jovemnerd.com.br/nerdcast/nerdcast-514-turistas-babacas-2/</link>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].link.should
          .equal('https://jovemnerd.com.br/nerdcast/nerdcast-514-turistas-babacas-2/');
        done();
      });
    });

  it('should the first item have the pubDate ' +
    '\'Fri, 29 Apr 2016 06:28:29 +0000\' when the link tag and options set date as string',
      function (done) {
	      const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
          '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
          '</item></channel></rss>';

        podcastParser.parse(xml, { dateAs: 'string' }, function (err, data) {
          data.channel.items[0].pubDate.should.equal('Fri, 29 Apr 2016 06:28:29 +0000');
          done();
        });
      });

  it('should the first item have the pubDate as type of string ' +
    '\'Fri, 29 Apr 2016 06:28:29 +0000\' when the link tag and options set date as string',
      function (done) {
	      const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
          '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
          '</item></channel></rss>';

        podcastParser.parse(xml, { dateAs: 'string' }, function (err, data) {
          data.channel.items[0].pubDate.should.to.be.a('string');
          done();
        });
      });

  it('should the first item have the pubDate ' +
    '\'Fri, 29 Apr 2016 06:28:29 +0000\' when the link tag and options',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { }, function (err, data) {
        data.channel.items[0].pubDate.should.equal('Fri, 29 Apr 2016 06:28:29 +0000');
        done();
      });
    });

  it('should the first item have the pubDate ' +
    '\'20160329062829\' when the link tag and options set date as number',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { dateAs: 'number' }, function (err, data) {
        data.channel.items[0].pubDate.should.equal(20160329062829);
        done();
      });
    });

  it('should the first item have the pubDate to be a `number` ' +
    ' when the link tag and options set date as number',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { dateAs: 'number' }, function (err, data) {
        data.channel.items[0].pubDate.should.to.be.a('number');
        done();
      });
    });

  it('should the first item have the pubDate as `date`' +
    'when the link tag and options set date as string',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { dateAs: 'date' }, function (err, data) {
        data.channel.items[0].pubDate.should.to.be.a('date');
        done();
      });
    });

  it('should the first item have the pubDate \'Fri, 29 Apr 2016 06:28:29 +0000\' as date ' +
    'when the link tag and options set date as string',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { dateAs: 'date' }, function (err, data) {
        data.channel.items[0].pubDate.should.be.eql(new Date(2016, 3, 29, 6, 28, 29));
        done();
      });
    });

  it('should the first item have the pubDate [2016, 3, 29, 6, 28, 29] ' +
    'when the link tag and options set date as array',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<pubDate>Fri, 29 Apr 2016 06:28:29 +0000</pubDate>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { dateAs: 'array' }, function (err, data) {
        data.channel.items[0].pubDate.should.be.eql([2016, 3, 29, 6, 28, 29]);
        done();
      });
    });

  it('should the first item have the description \'<p>Hoje Alexandre Ottoni o Jovem Nerd, Sr. K, ' +
    'Guga Mafra, Portuguesa e Deive Pazos o Azaghal colocam seus monóculos para a segunda parte ' +
    'de Turistas Babacas!</p><p>O post Nerdcast 514 – Turistas Babacas 2 apareceu primeiro' +
    ' em Jovem Nerd.</p>\' when the link tag and options set date as array',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<description><![CDATA[<p>Hoje Alexandre Ottoni o Jovem Nerd, Sr. K, Guga Mafra, ' +
        'Portuguesa e Deive Pazos o Azaghal colocam seus monóculos para a segunda parte de ' +
        'Turistas Babacas!</p><p>O post Nerdcast 514 &#8211; Turistas Babacas 2 apareceu primeiro' +
        ' em Jovem Nerd.</p>]]></description></item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].description.should.equal('<p>Hoje Alexandre Ottoni o Jovem Nerd, ' +
          'Sr. K, Guga Mafra, Portuguesa e Deive Pazos o Azaghal colocam seus monóculos para a ' +
          'segunda parte de Turistas Babacas!</p><p>O post Nerdcast 514 – Turistas Babacas ' +
          '2 apareceu primeiro em Jovem Nerd.</p>');
        done();
      });
    });

  it('should the first item have the duration 1:41:56 ' +
    'when the link tag \'itunes:duration\'',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<itunes:duration>1:41:56</itunes:duration>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].duration.should.equal('1:41:56');
        done();
      });
    });

  it('should the first item have the duration [1,41,56] ' +
    'when the link tag \'itunes:duration\' and set time as array',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<itunes:duration>1:41:56</itunes:duration>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { timeAs: 'array' }, function (err, data) {
        data.channel.items[0].duration.should.be.eql([1, 41, 56]);
        done();
      });
    });

  it('should the first item have the duration 14156 ' +
    'when the link tag \'itunes:duration\' and set time as number',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<itunes:duration>1:41:56</itunes:duration>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, { timeAs: 'number' }, function (err, data) {
        data.channel.items[0].duration.should.equal(564101);
        done();
      });
    });

  it('should the first item have a enclosure when the link tag \'enclosure\'',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<enclosure url="https://jovemnerd.com.br/podpress_trac/feed/148003/0/nc514.mp3" ' +
        'length="73512785" type="audio/mpeg" />' +
        '</item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        should.exist(data.channel.items[0].enclosure);
        done();
      });
    });

  it('should the first item have a enclosure with url, length and type when the link tag' +
      ' \'enclosure\'',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<enclosure url="https://jovemnerd.com.br/podpress_trac/feed/148003/0/nc514.mp3" ' +
        'length="73512785" type="audio/mpeg" />' +
        '</item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].enclosure.should.be.eql({
          url: 'https://jovemnerd.com.br/podpress_trac/feed/148003/0/nc514.mp3',
          length: 73512785,
          type: 'audio/mpeg',
        });
        done();
      });
    });

  it('should the first item have a subtitle when the \'Hoje Alexandre Ottoni o Jovem Nerd, Sr. K,' +
      ' Guga Mafra, Portuguesa e Deive Pazos o Azaghal colocam seus monóculos para a segunda ' +
      'parte de Turistas Babacas! O post Nerdcast 514 – Turistas Babacas 2 apareceu ' +
      'primeiro em Jovem Nerd.\' tag \'itunes:subtitle\'',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<itunes:subtitle>Hoje Alexandre Ottoni o Jovem Nerd, Sr. K, Guga Mafra, Portuguesa e ' +
        'Deive Pazos o Azaghal colocam seus monóculos para a segunda parte de Turistas Babacas! O' +
        ' post Nerdcast 514 &#8211; Turistas Babacas 2 apareceu primeiro em Jovem Nerd.' +
        '</itunes:subtitle>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].subtitle.should.equal('Hoje Alexandre Ottoni o Jovem Nerd, Sr. K,' +
          ' Guga Mafra, Portuguesa e Deive Pazos o Azaghal colocam seus monóculos para a segunda ' +
          'parte de Turistas Babacas! O post Nerdcast 514 – Turistas Babacas 2 apareceu ' +
          'primeiro em Jovem Nerd.');
        done();
      });
    });

  it('should the first item have a summary when the \'Hoje Alexandre Ottoni o Jovem Nerd, Sr. K,' +
      ' Guga Mafra, Portuguesa e Deive Pazos o Azaghal colocam seus monóculos para a segunda ' +
      'parte de Turistas Babacas! O post Nerdcast 514 – Turistas Babacas 2 apareceu ' +
      'primeiro em Jovem Nerd.\' tag \'itunes:summary\'',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<itunes:summary>Hoje Alexandre Ottoni o Jovem Nerd, Sr. K, Guga Mafra, Portuguesa e ' +
        'Deive Pazos o Azaghal colocam seus monóculos para a segunda parte de Turistas Babacas! O' +
        ' post Nerdcast 514 &#8211; Turistas Babacas 2 apareceu primeiro em Jovem Nerd.' +
        '</itunes:summary>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].summary.should.equal('Hoje Alexandre Ottoni o Jovem Nerd, Sr. K,' +
          ' Guga Mafra, Portuguesa e Deive Pazos o Azaghal colocam seus monóculos para a segunda ' +
          'parte de Turistas Babacas! O post Nerdcast 514 – Turistas Babacas 2 apareceu ' +
          'primeiro em Jovem Nerd.');
        done();
      });
    });

  it('should the first item have a content when the \'<p><strong>Neste Podcast:</strong> Vá para ' +
      'uma festa em um castelo em praga, se inspire na família Griswald e conheça o Willy Wonka ' +
      'do inferno!</p><blockquote><p><strong>ARTE DA VITRINE: <strong><em><a ' +
      'href="http://www.cirosollero.com/">Ciro Sollero</a></em></strong></strong></p>' +
      '</blockquote><h3>N­PIX | Escola online de artes digitais</h3><p>Acesse: <a ' +
      'href="http://bit.ly/1NWTv83">http://bit.ly/1NWTv83</a></p>.\' tag \'content:encoded\'',
    function (done) {
	    const xml = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item>' +
        '<content:encoded><![CDATA[<p><strong>Neste Podcast:</strong> Vá para uma festa em um ' +
        'castelo em praga, se inspire na família Griswald e conheça o Willy Wonka do inferno!</p>' +
        '<blockquote><p><strong>ARTE DA VITRINE: <strong><em><a ' +
        'href="http://www.cirosollero.com/">Ciro Sollero</a></em></strong></strong></p>' +
        '</blockquote><h3>N­PIX | Escola online de artes digitais</h3><p>Acesse: <a ' +
        'href="http://bit.ly/1NWTv83">http://bit.ly/1NWTv83</a></p>]]></content:encoded>' +
        '</item></channel></rss>';

      podcastParser.parse(xml, {}, function (err, data) {
        data.channel.items[0].content.should.equal('<p><strong>Neste Podcast:</strong> Vá para ' +
            'uma festa em um castelo em praga, se inspire na família Griswald e conheça o Willy ' +
            'Wonka do inferno!</p><blockquote><p><strong>ARTE DA VITRINE: <strong><em><a ' +
            'href="http://www.cirosollero.com/">Ciro Sollero</a></em></strong></strong></p>' +
            '</blockquote><h3>N­PIX | Escola online de artes digitais</h3><p>Acesse: <a ' +
            'href="http://bit.ly/1NWTv83">http://bit.ly/1NWTv83</a></p>');
        done();
      });
    });
});
