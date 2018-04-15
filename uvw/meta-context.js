'use strict';

var path = require('path');
var uvwlib = require('uvwlib');
var nodeUtils = require('../lib/utils');

var metaFactory = require('./meta-factory');

var MetaContext = {
  instance: function (parent, name, spec) {
    return Object.create(MetaContext).init(parent, name, spec);
  },

  init: function(parent, name, spec) {
    spec = spec || {};
    if (parent && !name) throw new Error('missing name');
    if (parent && !parent.root) throw new Error('parent missing root');
    if (!parent && !spec.baseDir) throw new Error('missing baseDir');

    this.parent = parent || null;
    this.name = name || '';
    this.spec = spec;
    this.root = parent ? parent.root : this;
    this.path = parent ? parent.path.concat(name) : [];
    this.baseDir = parent ? path.join(parent.baseDir, name) : path.resolve(spec.baseDir);

    this._factory = spec.factory;;
    this._index = spec.index || null;
    this._cntxs = {};

    return this;
  },

  filePath: function() {
    return path.resolve.apply(null, uvwlib.flatten(this.baseDir, arguments));
  },

  relPathTo: function(cwd) {
    return path.relative(this.baseDir, cwd || process.cwd());
  },
  relPathFrom: function(cwd) {
    return path.relative(cwd || process.cwd(), this.baseDir);
  },
  hasFile: function() {
    return nodeUtils.isFile(this.filePath.apply(this, arguments));
  },
  hasDirectory: function() {
    return nodeUtils.isDirectory(this.filePath.apply(this, arguments));
  },

  factory: function() {
    return this._factory || (this.parent ? this.parent.factory() : metaFactory); 
  },

  index: function() {
    return this._index || (this._index = this.factory().createIndex(this));
  },

  cd: function(name) {
    return this.child(name) || this.index().cd(name);
  },

  child: function(name) {
    return this._cntxs[name];
  },

  pushChild: function(name, spec) {
    var child = typeof name === 'object' ? name : null;
    var childName = child ? child.name : name;

    if (!childName) throw new Error('missing name');
    if (this.child(childName)) throw new Error(childName + ' exists');
    if (child && child.parent !== this) throw new Error('parent mismatch');

    if (!child) child = MetaContext.instance(this, childName, spec);
    return this._cntxs[childName] = child;
  },

  setIndex: function(index) {
    if (this._index) throw new Error('index exists');
    this._index = index;
    return this;
  },

  evaluate: function(req) {
    var sub = req.path[0] && this.index().cd(req.path[0]);
    if (sub) {
      req = uvwlib.defaults({ path: req.path.slice(1) }, req);
      return sub.evaluate(req);
    }

    return this.index().evaluate(req);
  },
};

module.exports = MetaContext;
