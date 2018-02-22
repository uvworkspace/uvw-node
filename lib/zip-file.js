'use strict';

var fs = require('fs');
var shell = require('shelljs');
var path = require('path');
var join = path.join;
var fs = require('fs');

var uvwlib = require('uvwlib');
var Zip = require('uvwlib/lib/zip');

var IGNORES = [ /^\./, 'node_modules', 'dist' ];
var UVW_EXTS = [
  '.txt', '.html', '.htm', '.xml', '.md', '.yaml',
  '.css', '.less', '.scss',
  '.js', '.json',
  '.nunj', '.mp' // uvw
];

function match(str, pats) {
  if (!Array.isArray(pats)) pats = [pats];
  for (var i=0, n=pats.length; i<n; i++) {
    var pat = pats[i];
    if (typeof pat === 'string') {
      if (pat === str) return true;
    } else {
      if (pat.test(str)) return true;
    }
  }
  return false;
}

function pack(dirPath, opts, zip, isTop) {
  fs.readdirSync(dirPath).forEach(function(fname) {
    if (opts.ignores && match(fname, opts.ignores)) return;
    if (isTop && opts.tops && !match(fname, opts.tops)) return;

    var fpath = join(dirPath, fname);
    var stats = fs.statSync(fpath);
    if (stats.isDirectory()) {
      pack(fpath, opts, zip.dir(fname), false);
    } else if (stats.isFile()) {
      var b = opts.files && match(fname, opt.files);
      var link = false;
      if (!b) {
        var ext = path.extname(fname);
        if (ext) {
          b = opts.exts && match(ext, opts.exts);
          if (!b && opts.includePath) {
            link = !opts.ignoreExts || !match(ext, opts.ignoreExts);
          }
        } else {
          link = opts.includeEmptyExt;
        }
      }

      if (b) {
        try {
          zip.add(fname, fs.readFileSync(fpath, 'utf8'));
        } catch(ex) {
          console.error(ex);
        }
      } else if (link) {
        zip.info(fname, { path: path.resolve(fpath) });
      }
    }
  });

  return zip;
}

var ZipFile = uvwlib.assignSafe(Zip, {
  readDir: function(dirPath, opts) {
    if (!shell.test('-d', dirPath)) throw Error(dirPath + ' not a folder');

    opts = uvwlib.assign({ ignores: IGNORES, exts: UVW_EXTS }, opts);
    return pack(dirPath, opts, ZipFile.instance(path.basename(dirPath)), true);
  },

  extractTo: function (fpath) {
    if (!shell.test('-d', fpath)) throw Error(fpath + ' not a folder');

    for (var i=0, n=this.files.length; i<n; i++) {
      var file = this.files[i];
      if (file.name) {
        var child = join(fpath, file.name);
        if (file.isZip) {
          shell.mkdir('-p', child); 
          file.extractTo(child);
        } else if (typeof file.text === 'string') {
          fs.writeFileSync(child, file.text, 'utf8');
        } else if (file.path && shell.test('-f', file.path)) {
          shell.cp(file.path, child); 
        }
      }
    }
  }
});

module.exports = ZipFile;

