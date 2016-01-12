/**
 * Simple wrapper around mocha describe which allows a boolean to be passed in first which
 * determines whether or not the test will be run
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.describeIf = describeIf;

function describeIf(test, a, b) {
  if (test) {
    describe(a, b);
  } else {
    describe.skip(a, b);
  }
}