'use strict';

var uvwUtils = require('../lib/utils');
var frontMatter = require('uvwlib/lib/front-matter');
var FrontWrapper = require('uvwlib/lib/front-wrapper');

function mpFile(fname) {
  return uvwUtils.readFile(fname, {
    defaultFile: 'index.mp',
    extName: '.mp'
  });
}

function mpFront(fname) {
  return frontMatter(mpFile(fname));
}

function mpFrontWrapper(fname) {
  return FrontWrapper.instance(mpFile(fname));
}

module.exports = {
  mpFile: mpFile,
  mpFront: mpFront,
  mpFrontWrapper: mpFrontWrapper,
};
