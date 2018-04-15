'use strict';

var path = require('path');
var fs = require('fs');

var uvwlib = require('uvwlib');

var FileJsonStore = uvwlib.class({
  init: function(fpath) {
    this.fpath = fpath;
    this._json = null;
    return this;
  },

  json: function() {
    return this._json || (this._json = !fs.existsSync(this.fpath) ? {} :
      JSON.parse(fs.readFileSync(this.fpath, 'utf8')));
  },

  load: function(field) {
    return this.json()[field];
  },

  pick: function() {
    return uvwlib.pick(this.json(), arguments);
  },

  save: function(field, data) { 
    var json = this.json();
    if (data === undefined) delete json[field];
    else json[field] = data;
    fs.writeFileSync(this.fpath, JSON.stringify(json, null, 2));
  },
});

module.exports = FileJsonStore;
