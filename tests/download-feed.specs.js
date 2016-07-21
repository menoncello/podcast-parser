'use strict';

const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');
const mockery = require('mockery');
const requestNerdcast = require('./stubs/request-nerdcast');
const requestTimeout = require('./stubs/request-timeout');
const requestTimeoutError = require('./stubs/request-timeout-error');

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

    podcastParser.download('', function (err) {
      should.exist(err);
      done();
    });

  });

  it('download - should has a length of 4,378,642 when loading nerdcast file', function (done) {
    mockery.registerMock('request', requestNerdcast);
    podcastParser = require('../index.js');

    podcastParser.download('nerdcast', function (err, data) {
      data.length.should.be.equal(4378642);
      done();
    });

  });

  it('download - should data exists when request nerdcast file', function (done) {
    mockery.registerMock('request', requestNerdcast);
    podcastParser = require('../index.js');

    podcastParser.download('nerdcast', function (err, data) {
      should.exist(data);
      done();
    });
  });

	it('download - the default timeout must be 30000', function (done) {
		mockery.registerMock('request', requestTimeout);
		podcastParser = require('../index.js');

		podcastParser.download('asd', function (err, data) {
			data.timeout.should.be.equal(30000);
			done();
		});

	});

	it('download - timeout should be 60 when passing 60000 as timeout in the options', function (done) {
		mockery.registerMock('request', requestTimeout);
		podcastParser = require('../index.js');

		podcastParser.download('asd', { timeout: 60000 }, function (err, data) {
			data.timeout.should.be.equal(60000);
			done();
		});

	});

	it('download - should give a error, when request has timeout', function (done) {
		mockery.registerMock('request', requestTimeoutError);
		podcastParser = require('../index.js');

		podcastParser.download('asd', {}, function (err) {
			should.exist(err);
			done();
		});
	});
});
