'use strict';

var path = require('path');
var join = path.join;
var shell = require('shelljs');
var test = require('tap').test;

var Path = require('../lib/path');

test('Path has some path and file utilities', function(t) {
  var fname = path.basename(__filename);
  var dir = Path.instance(__dirname);
  t.ok(dir.isDirectory());
  t.false(dir.isFile());

  t.equal(dir.path, __dirname);
  t.equal(dir.join(fname).path, __filename);
  t.equal(dir.join('a', 'b').path, path.join(__dirname, 'a', 'b'));
  t.equal(dir.resolve('a', 'b').path, path.resolve(__dirname, 'a', 'b'));

  t.ok(dir.join(fname).exists());
  t.ok(dir.join(fname).isFile());
  t.false(dir.join(fname).isDirectory());
  t.type(dir.join(fname).readFile(), 'string');
  t.end();
});

