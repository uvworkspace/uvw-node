'use strict';

var SimpleCli = require('./simple-cli');

var SimpleIndex = SimpleCli.subclass({
  init: function(cntx, simpleMeta) {
    this.cntx = cntx;
    this.meta = simpleMeta;
    return this;
  },

  cd: function(name) {
    return this.meta.cdForIndex(this.cntx, name);
  },
});

module.exports = SimpleIndex;
