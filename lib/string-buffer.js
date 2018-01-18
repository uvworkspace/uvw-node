
var stream = require('stream');
var Transform = stream.Transform;

var uvwlib = require('uvwlib');

function nop () {}

var StringBuffer = uvwlib.inherit(Transform.prototype, {
  stringReadable: function (text) {
    var s = new stream.Readable();
    s._read = nop;
    s.push(text || '');
    s.push(null);
    return s;
  },

  init: function (s, encoding) {
    Transform.call(this);
    this.chunks = [];
    this.result = undefined;
    this.encoding = encoding || 'utf8';
    if (s) this.push(s);
    return this;
  },
  _transform: function (s, encoding, done) {
    this.chunks.push(encoding === 'buffer' ? s.toString(this.encoding) : s);
    done();
  },
  _flush: function (done) {
    this.result = this.chunks.join('');
    this.chunks = null;
    this.push(this.result);
    done();
  }
});

module.exports = StringBuffer;
