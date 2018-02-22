'use strict';

var path = require('path');
var join = path.join;
var shell = require('shelljs');
var test = require('tap').test;

var ZipFile = require('../lib/zip-file');

test('zip-file can write to/read from folder', function(t) {
  var DIR = path.resolve(__dirname, '../dist/test-zip');
  shell.mkdir('-p', DIR);
  var zip = ZipFile.instance('test-zip');
  zip.add('foo.txt', 'Foo Txt')
    .dir('bar')
      .add('baz.txt', 'Baz Txt');

  zip.extractTo(DIR);

  t.ok(shell.test('-d', DIR));
  t.equal(shell.cat(join(DIR, 'foo.txt')).toString(), 'Foo Txt');
  t.ok(shell.test('-d', join(DIR, 'bar')));
  t.equal(shell.cat(join(DIR, 'bar', 'baz.txt')).toString(), 'Baz Txt');

  var zip2 = ZipFile.readDir(DIR);
  t.equal(JSON.stringify(zip), JSON.stringify(zip2));
  t.end();
});

