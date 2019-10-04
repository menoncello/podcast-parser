'use strict';

const v = require('voca');

exports.month = monthHelper;
exports.arrayDate = arrayDateHelper;
exports.numberDate = numberDateHelper;
exports.date = dateHelper;

function monthHelper(month) {
  month = month.toLowerCase();

  switch (month) {
    case 'jan': return 0;
    case 'feb': return 1;
    case 'mar': return 2;
    case 'apr': return 3;
    case 'may': return 4;
    case 'jun': return 5;
    case 'jul': return 6;
    case 'aug': return 7;
    case 'sep': return 8;
    case 'oct': return 9;
    case 'nov': return 10;
    case 'dec': return 11;
    default:
      return null;
  }
}

function arrayDateHelper(date) {
  date = v(date).replaceAll(':', '-').slugify();
  let dateArr = date.split('-');

  // console.log(dateArr);

  return [
    parseInt(dateArr[3]),
    monthHelper(dateArr[2]),
    parseInt(dateArr[1]),
    parseInt(dateArr[4]),
    parseInt(dateArr[5]),
    parseInt(dateArr[6]),
  ];
}

function numberDateHelper(date) {
  let arr = arrayDateHelper(date);
  return arr[0] * 10000000000 +
    arr[1] * 100000000 +
    arr[2] * 1000000 +
    arr[3] * 10000 +
    arr[4] * 100 +
    arr[5];
}

function dateHelper(date) {
  let arr = arrayDateHelper(date);
  return new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
}
