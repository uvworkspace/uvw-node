'use strict';

const STATUS_CODES = {
  400: 'BadRequest',
  401: 'Unauthorized',
  402: 'PaymentRequired',
  403: 'Forbidden',
  404: 'NotFound',
  405: 'MethodNotAllowed',
  406: 'NotAcceptable',
  407: 'ProxyAuthenticationRequired',
  408: 'RequestTimeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'LengthRequired',
  412: 'PreconditionFailed',
  413: 'RequestEntityTooLarge',
  414: 'RequestUriTooLong',
  415: 'UnsupportedMediaType',
  416: 'RequestedRangeNotSatisfiable',
  417: 'ExpectationFailed',
  500: 'InternalServerError',
  501: 'NotImplemented',
  502: 'BadGateway',
  503: 'ServiceUnavailable'
};

exports.httpError = function(err, statusCode) {
  err = err || new Error();
  if (typeof err === 'string') err = new Error(err);

  var code = +(statusCode || err.statusCode);
  if (!isFinite(code)) code = 500;

  var name = STATUS_CODES[code];
  if (!name) name = STATUS_CODES[code = 500];

  err.statusCode = code;
  err.name = name;
  if (!err.message) err.message = name;
  return err;
};

exports.notFound = function(err) {
  return exports.httpError(err, 404);
};

exports.badRequest = function(err) {
  return exports.httpError(err, 400);
};

exports.unauthorized = function(err) {
  return exports.httpError(err, 401);
};

