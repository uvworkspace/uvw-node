'use strict';

var uvwlib = require('uvwlib');

module.exports = uvwlib.assign(
  { MetaContext: require('./meta-context') },
  require('./meta-factory'),
  require('./utils'));
