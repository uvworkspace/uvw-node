'use strict';

const uvw = require('../lib/utils');
const frontMatter = require('uvwlib/lib/front-matter');

function mpFile(fname) {
  return uvw.readFile(fname, {
    defaultFile: 'index.mp',
    extName: '.mp'
  });
}

function mpFront(fname) {
  return frontMatter(mpFile(fname));
}

module.exports = {
  mpFile: mpFile,
  mpFront: mpFront,
};
