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

    podcastParser.execute('', {}, function (err) {
      should.exist(err);
      done();
    });

  });
});
