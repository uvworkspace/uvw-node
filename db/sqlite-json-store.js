'use strict';

var path = require('path');

var uvwlib = require('uvwlib');
var SqliteSync = require('./sqlite-sync');

var SqliteJsonStore = uvwlib.class({
  init: function(fpath, opts) {
    this.opts = uvwlib.assign({}, opts);
    this.fpath = fpath;
    this.tableName = this.opts.tableName || 'store';
    this._db = null;
    return this;
  },

  db: function() {
    if (!this._db) {
      this._db = SqliteSync.instance(this.fpath, this.opts);
      this._db.stmt('CREATE TABLE IF NOT EXISTS ' + this.tableName +
        ' (key VARCHAR(100), val TEXT)').run();
    }
    return this._db;
  },

  load: function(field) {
    var s = this.db().stmt('SELECT val FROM ' + this.tableName + ' WHERE key = ?').get(field);
    if (s) return JSON.parse(s.val);
  },

  save: function(field, data) { 
    if (this.load(field) !== undefined) {
      this.db().stmt('UPDATE ' + this.tableName + ' SET val = ? WHERE key = ?')
        .run(JSON.stringify(data), field);
    } else {
      this.db().stmt('INSERT INTO ' + this.tableName + ' (key, val) VALUES (?, ?)')
        .run(field, JSON.stringify(data));
    }
  },
});

module.exports = SqliteJsonStore;
