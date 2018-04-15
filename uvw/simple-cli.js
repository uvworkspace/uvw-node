'use strict';

var path = require('path');
var uvwlib = require('uvwlib');
var uvwUtils = require('./utils');

var SimpleCli = uvwlib.class({
  init: function(cntx) {
    this.cntx = cntx;
    return this;
  },

  parentIndex: function() {
    return this.cntx.parent && this.cntx.parent.index();
  },

  evaluate: function (req) {
    if (req.path.length) {
      return 'unknown ' + this.cntx.path.join('/')
           + '/' + req.cmd + ' ' + req.path.join('/');  
    }

    if (req.cmd === 'xbar') {
      var arg0 = req.args[0] || 'info';
      var fn = this['xbar_' +  arg0];
      if (typeof fn === 'function') return fn.call(this, req.args.slice(1), req.opts);
    }

    var fn = this['cli_' + req.cmd];
    if (typeof fn !== 'function') {
      return console.error('error processing command', req.cmd);
    }
      
    return fn.call(this, req.args, req.opts);
  },
});

module.exports = SimpleCli;
