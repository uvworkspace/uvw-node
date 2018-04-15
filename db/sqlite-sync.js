'use strict';

const path = require('path');
const Sqlite = require('better-sqlite3');

const uvwlib = require('uvwlib');

const SqliteSync = uvwlib.class({
  init: function(fpath, opts) {
    opts = opts || {};

    this._schema = opts.schema || {};
    this._stmts = {};
    this.db = new Sqlite(fpath, opts);

    this.stmt('CREATE TABLE IF NOT EXISTS test (info TEXT)').run();

    return this;
  },

  ensureTable: function(name) {
    var sch = this._schema[name];
    if (sch && sch.columns) {
      var sql = 'CREATE TABLE IF NOT EXISTS ' + name + ' ' + sch.columns;
      this.stmt(sql.run());
      return true;
    }
  },

  hasTable: function(name) {
    var s = "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?";
    return !!this.stmt(s).get(name);
  },

  stmt: function(sql) {
    return this._stmts[sql] || (this._stmts[sql] = this.db.prepare(sql));
  },
});

module.exports = SqliteSync;
