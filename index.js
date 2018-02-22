'use strict';

const uvwlib = require('uvwlib');

module.exports = uvwlib.assign({},
  uvwlib,
  require('./lib/utils'));
