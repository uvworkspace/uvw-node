'use strict';

var path = require('path');
var resolve = path.resolve;
var join = path.join;
var fs = require('fs');

var utils = require('./utils');

var Path = {
  instance: function() { // resolved
    var absPath = path.resolve.apply(null, arguments); 
    return Object.create(Path).init(absPath);
  },

  init: function(absPath) {
    this.path = absPath;
    return this;
  },
  join: function() {
    return Path.instance(join.bind(null, this.path).apply(null, arguments));
  },
  resolve: function() {
    return Path.instance(resolve.bind(null, this.path).apply(null, arguments));
  },
  exists: function() {
    return fs.existsSync(this.path);
  },
  isDirectory: function() {
    return utils.isDirectory(this.path);
  },
  isFile: function() {
    return utils.isFile(this.path);
  },
  readFile: function (opts) {
    return utils.readFile(this.path, opts);
  },
};

module.exports = Path;
