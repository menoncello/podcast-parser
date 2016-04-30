(function () {
  'use strict';

  let chai = require('chai');
  let should = chai.should();
  let sinon = require('sinon');
  let mockery = require('mockery');

  let sandbox = sinon.sandbox.create();
  let request = function (url, callback) {
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

    it('parse - should return error if data is empty', function (done) {

      podcastParser.parse('', {}, function (err, data) {
        should.exist(err);
        done();
      });

    });

    it('parse - should return existing object when passing a xml only with the rss',
      function (done) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>';

        podcastParser.parse(xml, {}, function (err, data) {
          should.exist(data);
          done();
        });
      });

    it('parse - should return version \'2.0\' when passing a xml only with the rss',
      function (done) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>';

        podcastParser.parse(xml, {}, function (err, data) {
          console.log(data);
          data.version.should.equal('2.0');
          done();
        });
      });
  });
})();
