'use strict';

var path = require('path');
var fs = require('fs');
var yamlParser = require('uvwlib/lib/front-matter').yamlParser;
var nodeUtils = require('../lib/utils');
var mpUtils = require('../mp');
//var MdIndex = require('./md-index');
//var MdDev = require('./md-dev');

var MP_TYPES = {
//  'md-dev': MdDev,
//  'md-index': MdIndex,
};

var factory = {
  createIndex: function(cntx) {
    var spec = cntx.spec;
    var ext = spec.metaExt, meta = spec.meta;
    var cls;
    if (ext === '.js') {
      cls = spec.meta;
    } else if (ext === '.json') {
      if (meta['meta-proto']) {
        return require(meta['meta-proto']).instance().newIndex(cntx);
      }

      if (meta.proto) {
        cls = require(meta.proto);
      } else if (meta.type) {
        cls = MP_TYPES[meta.type];
      }
    } else if (ext === '.yaml') {
      cls = meta.type && MP_TYPES[meta.type];
    } else if (ext === '.mp') {
      cls = meta.type && MP_TYPES[meta.type];
    }
    if (cls) return cls.instance(cntx);
  },

  rootSpec: function (fpath) {
    var file = path.join(fpath, '.uvw');
    // .uvw overrides package.json
    if (fs.existsSync(file)) {
      var spec = factory.folderSpec(file);
      spec.rootType = '.uvw';
      spec.baseDir = fpath;
      return spec;
    }

    if (fs.existsSync(file = path.join(fpath, 'package.json'))) {
      var pkg = JSON.parse(fs.readFileSync(file));
      var spec;
      if (pkg.uvw) {
        var meta = typeof pkg.uvw === 'object' && pkg.uvw;
        if (meta) {
          spec = {
            metaExt: '.json',
            metaFile: file,
            meta: meta,
          };
        } else {
          var main = typeof pkg.uvw === 'string' ? pkg.uvw : '.';
          spec = factory.folderSpec(path.resolve(fpath, main));
        }

        spec.rootType = 'package.json';
        spec.baseDir = fpath;
        return spec;
      }
    }
  },

  folderSpec: function(dirPath) {
    var ret, fpath;
    if (nodeUtils.isFile(fpath = path.join(dirPath, 'meta', 'index.js'))) {
      ret = {
        ext: '.js',
        file: fpath,
      }
    } else if (nodeUtils.isFile(fpath = path.join(dirPath, '_meta', 'index.js'))) {
      ret = {
        ext: '.js',
        file: fpath,
      }
    } else {
      ret = nodeUtils.hasFileExt(dirPath, '_meta', ['.js', '.json', '.yaml', '.mp']);
      ret = ret || nodeUtils.hasFileExt(dirPath, 'meta', ['.js', '.json', '.yaml', '.mp']);
    }

    if (ret) {
      var ext = ret.ext;
      var file = ret.file;
      var meta;
      if (ext === '.js') {
        meta = require(file);
      } else if (ext === '.json') {
        meta = require(file);
      } else if (ext === '.yaml') {
        var txt = fs.readFileSync(file, 'utf8');
        meta = txt.trim() ? yamlParser.safeLoad(txt) : {};
      } else if (ext === '.mp') {
        var front = mpUtils.mpFront(file);
        meta = front[0].data;
        meta._texts = front[0].texts;
        meta._sections = front.slice(1);
      }
      if (meta) return {
        metaExt: ext,
        metaFile: file,
        meta: meta
      };
    }
  },

  childSpec: function(cntx, name) {
    return factory.folderSpec(cntx.filePath(name));
  },
};

module.exports = factory;
