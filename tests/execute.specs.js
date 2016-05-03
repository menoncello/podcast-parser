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

describe('execute', function () {

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

  it('execute - should return error if url is empty', function (done) {

    podcastParser.execute('', {}, function (err, data) {
      should.exist(err);
      done();
    });

  });
});
