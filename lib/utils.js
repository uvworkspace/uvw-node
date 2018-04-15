'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const flatten = require('uvwlib/lib/utils/flatten');

function resolve () {
  return path.resolve.apply(null, flatten(arguments));
}

const utils = {
  inspect: function (obj, opts = { showHidden: false, depth: null }) {
    return util.inspect(obj, opts);
  },

  log: function () {
    console.log.apply(console, Array.prototype.map.call(arguments, x => utils.inspect(x)));
  },

  resolve: resolve,

  isDirectory: function () {
    try {
      return fs.statSync(resolve.apply(null, arguments)).isDirectory();
    } catch (ex) {
      return false;
    }
  },

  isFile: function () {
    try {
      return fs.statSync(resolve.apply(null, arguments)).isFile();
    } catch (ex) {
      return false;
    }
  },

  hasFileExt: function (basedir, fname, exts) {
    for (var i=0; i<exts.length; i++) {
      var f = path.resolve(basedir, fname + exts[i]);
      if (utils.isFile(f)) return {
        file: f,
        ext: exts[i]
      };
    }
  },

  readFile: function () {
    var len = arguments.length, opts;
    if (len === 0) return;

    var opts = arguments[len-1];
    if (!opts || typeof opts === 'object') len--;
    opts = opts || {};

    var names = [].slice.call(arguments, 0, len);
    if (opts.relPath) names.push(opts.relPath);
    var fpath = resolve.apply(null, names);

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

      if (stats.isFile()) return fs.readFileSync(fpath, opts.encoding || 'utf8');
    } catch(ex) {
      console.error(ex);
    }

    // undefined otherwise
  },
};

utils.isDir = utils.isFolder = utils.isDirectory;

module.exports = utils;
