(function () {
  'use strict';

  let chai = require('chai');
  let should = chai.should();
  let sinon = require('sinon');
  let mockery = require('mockery');
  let requestNerdcast = require('./stubs/request-nerdcast.js');

  let sandbox = sinon.sandbox.create();
  let request = function (url, callback) {
    callback();
  };

  let podcastParser;

  describe('download', function () {

    before(function () {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true,
      });
    });

    beforeEach(function () {
      mockery.registerAllowable('./stubs/request-nerdcast.js');
      mockery.registerAllowable('../index.js');
      mockery.registerAllowable('string');
      mockery.registerAllowable('xml2js');
      mockery.registerAllowable('querystring');
    });

    afterEach(function () {
      sandbox.verifyAndRestore();
      mockery.resetCache();
      mockery.deregisterAll();
    });

    after(function () {
      mockery.disable();
    });

    it('download - should return error if url is empty', function (done) {
      mockery.registerMock('request', request);
      podcastParser = require('../index.js');

      podcastParser.download('', {}, function (err, data) {
        should.exist(err);
        done();
      });

    });

    it('download - should has a length of 4,378,642 when loading nerdcast file', function (done) {
      mockery.registerMock('request', requestNerdcast);
      podcastParser = require('../index.js');

      podcastParser.download('nerdcast', {}, function (err, data) {
        data.length.should.be.equal(4378642);
        done();
      });

    });

    it('download - should data exists when request nerdcast file', function (done) {
      mockery.registerMock('request', requestNerdcast);
      podcastParser = require('../index.js');

      podcastParser.download('nerdcast', {}, function (err, data) {
        should.exist(data);
        done();
      });

    });
  });
})();
