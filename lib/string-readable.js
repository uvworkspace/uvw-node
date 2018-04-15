'use strict';

var stream = require('stream');

function stringReadable(text) {
  var s = new stream.Readable();
  s._read = function() {}; 
  s.push(text.toString());
  s.push(null);
  return s;
}

module.exports = stringReadable;

