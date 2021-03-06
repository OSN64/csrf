'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _csrf = require('csrf');

var _csrf2 = _interopRequireDefault(_csrf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CSRF =

/**
 * Factory method for the middleware.
 *
 * This constructor returns the actual middleware function.
 *
 * @param {Object} opts
 * @return {Function}
 */
function CSRF(opts) {
  var _this = this;

  _classCallCheck(this, CSRF);

  this.middleware = function (ctx, next) {

    ctx.__defineGetter__('csrf', function () {

      if (ctx._csrf) return ctx._csrf;

      if (!ctx.session) return null;

      if (!ctx.session.secret) ctx.session.secret = _this.tokens.secretSync();

      ctx._csrf = _this.tokens.create(ctx.session.secret);

      return ctx._csrf;
    });

    ctx.response.__defineGetter__('csrf', function () {
      return ctx.csrf;
    });

    if (_this.opts.excludedMethods.indexOf(ctx.method) !== -1) return next();

    if (!ctx.session.secret) ctx.session.secret = _this.tokens.secretSync();

    var bodyToken = ctx.request.body && typeof ctx.request.body._csrf === 'string' ? ctx.request.body._csrf : false;

    var token = bodyToken || !_this.opts.disableQuery && ctx.query && ctx.query._csrf || ctx.get('csrf-token') || ctx.get('xsrf-token') || ctx.get('x-csrf-token') || ctx.get('x-xsrf-token');

    if (!token && _this.opts.invalidTokenCallback(ctx, token)) return ctx.throw(_this.opts.invalidTokenStatusCode, _this.opts.invalidTokenMessage);

    if (!_this.tokens.verify(ctx.session.secret, token) && _this.opts.invalidTokenCallback(ctx, token)) return ctx.throw(_this.opts.invalidTokenStatusCode, _this.opts.invalidTokenMessage);

    return next();
  };

  this.opts = opts || {};

  if (!this.opts.invalidSessionSecretMessage) this.opts.invalidSessionSecretMessage = 'Invalid session secret';

  if (!this.opts.invalidSessionSecretStatusCode) this.opts.invalidSessionSecretStatusCode = 403;

  if (!this.opts.invalidTokenMessage) this.opts.invalidTokenMessage = 'Invalid CSRF token';

  if (!this.opts.invalidTokenStatusCode) this.opts.invalidTokenStatusCode = 403;

  if (!this.opts.excludedMethods) this.opts.excludedMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (typeof this.opts.disableQuery !== 'boolean') this.opts.disableQuery = false;

  if (typeof this.opts.invalidTokenCallback !== 'function') this.opts.invalidTokenCallback = function () {
    return true;
  };

  this.tokens = (0, _csrf2.default)(opts);

  return this.middleware;
}

/**
 * Middelware handler
 *
 * @param {Context} ctx
 * @param {Function} next
 * @return {Function}
 */
;

exports.default = CSRF;
module.exports = exports['default'];