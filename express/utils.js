'use strict';

const uvwlib = require('uvwlib');
const errors = require('./errors');
const errorHandler = require('errorhandler');

// just an example
exports.handleLastError = function(app, opts = {}) {
  app.use(function(res, req, next) {
    next(errors.notFound());
  });

  if (opts.isProd || process.NODE_ENV === 'production') {
    app.use(exports.ajaxErrorHandler);
    app.use(exports.errorHandler(opts));
  } else {
    app.use(errorHandler()); // Error handler - has to be last
  }
};

exports.ajaxErrorHandler = function(err, req, res, next) {
  if (req.xhr) {
    const code = +err.statusCode || 500;
    const ret = typeof err === 'string' ? {
      message: err,
      statusCode: code
    } : uvwlib.pick(err, 'statusCode', 'name', 'message');

    res.status(code).json(ret);
  } else {
    next(err);
  }
};

exports.errorHandler = function (opts = {}) {
  const tmplDir = opts.tmplDir || 'error/';

  return function (err, req, res, next) {
    if (err) console.error(err.stack || err.toString());

    const code = err.statusCode || 500;
    res.status(code);
    res.render(tmplDir + code, { error: err }, function(err, html) {
      if (err) return res.end('Sorry, server error');
      res.end(html);
    });
  };
};
