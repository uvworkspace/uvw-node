'use strict';

const util = require('util');

const inspect = exports.inspect = function(obj, depth) {
  return util.inspect(obj, {
    showHidden: false,
    depth: depth > 0 ? depth : null
  }); 
};

exports.log = function() {
  console.log.apply(console, Array.prototype.map.call(arguments, x => inspect(x)));
};
