'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');

const utils = {
  inspect: function (obj, opts = { showHidden: false, depth: null }) {
    return util.inspect(obj, opts);
  },

  log: function () {
    console.log.apply(console, Array.prototype.map.call(arguments, x => utils.inspect(x)));
  },

  dirExists: function (path) {
    try {
      return fs.statSync(path).isDirectory();
    } catch (ex) {
      return false;
    }
  },

  readFile: function (filePath, opts) {
    if (!filePath) return;

    opts = opts || {};

    var fpath = opts.relPath ? path.resolve(filePath, opts.relPath) : filePath;
    try {
      var stats = fs.statSync(fpath);
      if (stats.isDirectory() && opts.defaultFile) {
        fpath = path.join(fpath, opts.defaultFile);
        stats = fs.statSync(fpath);
      }

      var extName = opts.extName;
      if (extName && extName[0] !== '.') extName = '.' + extName;
      if (extName && stats.isFile()) {
        var ext = path.extname(fpath);
        if (!ext || ext !== extName) {
          var fname = path.basename(fpath, ext) + extName;
          fpath = path.resolve(path.dirname(fpath), fname);
          stats = fs.statSync(fpath);
        }
      }

      if (stats.isFile()) return fs.readFileSync(fpath, 'utf8');
    } catch(ex) {
      console.error(ex);
    }

    // undefined otherwise
  },
};

module.exports = utils;
