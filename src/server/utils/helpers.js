const _mergeWith = require('lodash/mergeWith');
module.exports.mergeIgnoringUndefined = (A, B) => _mergeWith({}, A, B, (a, b) => b === undefined ? a : undefined);
