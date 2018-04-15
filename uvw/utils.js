'use strict';

var path = require('path');
var fs = require('fs');
var shell = require('shelljs');

var uvwlib = require('uvwlib');
var ZipFile = require('../lib/zip-file');
var nodeUtils = require('../lib/utils');
var MetaContext = require('./meta-context');
var metaFactory = require('./meta-factory');

exports.findSpec = findSpec;
function findSpec(cwd) {
  if (typeof cwd !== 'string' || !cwd) return;

  var f, spec, initPath = [];
  while (!(spec = metaFactory.rootSpec(cwd))) {
    initPath.unshift(path.basename(cwd));
    var newd = path.resolve(cwd, '..');
    cwd = newd.length < cwd.length ? newd : null;
  }

  if (spec) spec.initPath = initPath;

  return spec;
};

exports.packageContext = function(baseDir, index) {
  return MetaContext.instance(null, null, {
    rootType: 'package.json',
    baseDir: path.resolve(baseDir),
    index: index
  });
};

exports.rootContext = function(fpath) {
  var spec = findSpec(path.resolve(fpath));
  if (spec && typeof spec === 'object') {
    return MetaContext.instance(null, null, spec);
  };
};

exports.evaluate = function(fpath, cmd, args, opts) {
  var spec = findSpec(path.resolve(fpath));
  if (typeof spec === 'string') return console.error(spec);

  var cntx = MetaContext.instance(null, null, spec);
  return cntx.evaluate({
    path: spec.initPath,
    cmd: cmd,
    args: args,
    opts: opts
  });
};

exports.initPackage = function(spec, opts) { 
  opts = opts || {};
  var zip = ZipFile.instance();
  var sub = zip.dir('.uvw');
  sub.add('meta.json', JSON.stringify(spec, null, 2) + '\n');

  var destDir = opts.baseDir || process.cwd();
  if (opts.subDir) {
    destDir = path.resolve(destDir, opts.subDir);
  }
  shell.mkdir('-p', destDir);
  if (!shell.test('-d', destDir)) {
    return 'Error creating directory ' + destDir;
  }
  zip.extractTo(destDir);
  console.log('Extracted to', destDir);
};

