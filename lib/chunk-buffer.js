'use strict';

var Transform = require('stream').Transform;

var uvwlib = require('uvwlib');
var chunker = require('uvwlib/lib/chunker');

var ChunkBuffer = uvwlib.inherit(Transform, {
  init: function (opts) {
    Transform.call(this);

    opts = opts || {};
    opts.handler || opts.handler === false || (opts.handler = this.push.bind(this));
    this._chunker = chunker(opts);
    return this;
  },

  _transform: function (s, encoding, done) {
    if (encoding === 'buffer') s = s.toString('utf8');
    this._chunker.push(s);
    done();
  },
  _flush: function (done) {
    var s = this._chunker.end();
    if (typeof s === 'string') {
      this.push(s);
      done();
    } else if (Promise.resolve(s) === s) {
      s.then(function(res) {
        this.push(res);
        done();
      }.bind(this), done);
    }
  },
});

module.exports = ChunkBuffer;
