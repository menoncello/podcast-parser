'use strict';

let dateHelper = require('../helpers/date-helper.js');
let chai = require('chai');
let should = chai.should();

describe('date helper - month', function () {

  var tests = [
    { arg: 'jan', expected: 0 },
    { arg: 'Jan', expected: 0 },
    { arg: 'JAN', expected: 0 },
    { arg: 'feb', expected: 1 },
    { arg: 'Feb', expected: 1 },
    { arg: 'FEB', expected: 1 },
    { arg: 'mar', expected: 2 },
    { arg: 'Mar', expected: 2 },
    { arg: 'MAR', expected: 2 },
    { arg: 'apr', expected: 3 },
    { arg: 'Apr', expected: 3 },
    { arg: 'APR', expected: 3 },
    { arg: 'may', expected: 4 },
    { arg: 'May', expected: 4 },
    { arg: 'MAY', expected: 4 },
    { arg: 'jun', expected: 5 },
    { arg: 'Jun', expected: 5 },
    { arg: 'JUN', expected: 5 },
    { arg: 'jul', expected: 6 },
    { arg: 'Jul', expected: 6 },
    { arg: 'JUL', expected: 6 },
    { arg: 'aug', expected: 7 },
    { arg: 'Aug', expected: 7 },
    { arg: 'AUG', expected: 7 },
    { arg: 'sep', expected: 8 },
    { arg: 'Sep', expected: 8 },
    { arg: 'SEP', expected: 8 },
    { arg: 'oct', expected: 9 },
    { arg: 'Oct', expected: 9 },
    { arg: 'OCT', expected: 9 },
    { arg: 'nov', expected: 10 },
    { arg: 'Nov', expected: 10 },
    { arg: 'NOV', expected: 10 },
    { arg: 'dec', expected: 11 },
    { arg: 'Dec', expected: 11 },
    { arg: 'DEC', expected: 11 },
  ];

  tests.forEach(function (test) {

    it('should returns ' + test.expected + ' when have \'' + test.arg + '\'', function () {
        let result = dateHelper.month(test.arg);
        result.should.equal(test.expected);
      });
  });
});

describe('date helper - date array', function () {

  var tests = [
    { arg: 'Fri, 29 Apr 2016 06:34:22 +0000', expected: [2016, 3, 29, 6, 34, 22] },
    { arg: 'Fri, 22 Apr 2016 03:01:00 +0000', expected: [2016, 3, 22, 3, 1, 0] },
  ];

  tests.forEach(function (test) {

    it('should returns [' + test.expected + '] when have \'' + test.arg + '\'', function () {
        let result = dateHelper.arrayDate(test.arg);
        result.should.to.eql(test.expected);
      });
  });
});

describe('date helper - date number', function () {

  var tests = [
    { arg: 'Fri, 29 Apr 2016 06:34:22 +0000', expected: 20160329063422 },
    { arg: 'Fri, 22 Apr 2016 03:01:00 +0000', expected: 20160322030100 },
  ];

  tests.forEach(function (test) {

    it('should returns ' + test.expected + ' when have \'' + test.arg + '\'', function () {
        let result = dateHelper.numberDate(test.arg);
        result.should.to.equal(test.expected);
      });
  });
});

describe('date helper - date', function () {

  var tests = [
    { arg: 'Fri, 29 Apr 2016 06:34:22 +0000', expected: new Date(2016, 3, 29, 6, 34, 22) },
    { arg: 'Fri, 22 Apr 2016 03:01:00 +0000', expected: new Date(2016, 3, 22, 3, 1, 0) },
  ];

  tests.forEach(function (test) {

    it('should returns [' + test.expected + '] when have ' + test.arg, function () {
        let result = dateHelper.date(test.arg);
        result.should.to.eql(test.expected);
      });
  });
});
