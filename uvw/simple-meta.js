'use strict';

var defaults = require('uvwlib').defaults;
var uvwUtils = require('./utils');
var SimpleCli = require('./simple-cli');
var metaFactory = require('./meta-factory');

var SimpleMeta = SimpleCli.subclass({
  ignore: function(name) {
    return !name || name[0] === '.' || name[0] === '_'
        || name === 'meta' || name.indexOf('node_modules') === 0;
  },

  cd: function(name) {
    if (this.ignore(name)) return;

    var child = this.cntx.child(name);
    if (!child) {
      var spec = metaFactory.childSpec(this.cntx, name);
      if (spec) child = this.cntx.pushChild(name, spec);
    }
    return child;
  },

  cdForIndex: function(cntx, name) {
    return cntx.child(name)
        || this.cd(name) && this.cd(name).index().newIndex(cntx.pushChild(name));
  },

  evaluate: function (req) {
    if (req.path.length) {
      var sub = this.cd(req.path[0]);
      if (sub) {
        req = defaults({ path: req.path.slice(1) }, req);
        return sub.evaluate(req);
      }
    }

    return SimpleCli.evaluate.call(this, req);
  },
});

module.exports = SimpleMeta;
