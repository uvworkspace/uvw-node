'use strict';

var URL = require('url');
var WebSocket = require('ws');

var uvwlib = require('uvwlib');

var Wsc = uvwlib.class({
  init: function(opts) {
    this.opts = opts || {};
    this._wsc = null;
  },

  start: function() {
    if (this._wsc) return;

    var port = this.opts.port || 8080;
    var wsc = this._wsc = new WebSocket('ws://localhost:' + port + '/');

    wsc.on('open', function () {
      wsc.send('wsc send open');
    });

    wsc.on('message', function (data) {
      console.log('from server', data);
    });

    console.log('client started:', 'ws://localhost:' + port + '/');
  },

  send: function(msg) {
    if (this._wsc) this._wsc.send(msg);
  },
});

var Ws = uvwlib.class({
  Wsc: Wsc,

  init: function(opts) {
    this.opts = opts || {};
    this._wss = null;
  },

  start: function() {
    if (this._wss) return;

    var port = this.opts.port || 8080;
    var wss = this._wss = new WebSocket.Server({
      port: port
    });

    wss.on('connection', function connection(ws, req) {
      //var loc = URL.parse(req.url, true);
      // You might use location.query.access_token to authenticate or share sessions
      // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
      ws.on('message', function (message) {
        console.log('received: %s', message);
      });

      ws.send('connected from', req.url);
    });

    console.log('server started on port', port);
  },
});

module.exports = Ws;
