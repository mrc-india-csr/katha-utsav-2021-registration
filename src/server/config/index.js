'use strict';
const { mergeIgnoringUndefined } = require('../utils/helpers');
const env = process.env.NODE_ENV;

const validEnvironments = ['local', 'dev', 'production'];

module.exports = /* istanbul ignore next */ mergeIgnoringUndefined(
  require('./defaults'),
  validEnvironments.indexOf(env) > -1 ? require('./' + env) : /* istanbul ignore next */ require('./local')
);