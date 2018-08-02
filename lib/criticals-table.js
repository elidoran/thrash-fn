'use strict'

// thank you benchmark.js
//
// critical values of t distribution with ν degrees of freedom for 95% certainty:
//   http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm
//
// NOTE:
// using an array instead of an object because we're accessing it via numbers
// so those can be indexes into the array. I added a null for the zero index.
// then set `infinity` on the array as a property.
//
// could specify as an object but i'd have to write out all the keys...
// instead, array syntax will handle making the keys.
module.exports = [
  null, // 0

  // 1 - 30
  12.706,
  4.303,
  3.182,
  2.776,
  2.571,
  2.447,
  2.365,
  2.306,
  2.262,
  2.228,
  2.201,
  2.179,
  2.16,
  2.145,
  2.131,
  2.12,
  2.11,
  2.101,
  2.093,
  2.086,
  2.08,
  2.074,
  2.069,
  2.064,
  2.06,
  2.056,
  2.052,
  2.048,
  2.045,
  2.042,
]

module.exports.infinity = 1.96
