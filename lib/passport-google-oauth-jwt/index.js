'use strict';
var passport = require('passport');
var request = require('request');
var url = require('url');
var util = require('util');

var SIMPLE_AUTH_PARAMS = {
	state: 'state',
	accessType: 'access_type',
	approvalPrompt: 'approval_prompt',
	loginHint: 'login_hint',
	includeGrantedScopes: 'include_granted_scopes',
	hostedDomain: 'hd'
};

var Strategy = module.exports.GoogleOauthJWTStrategy = function(options, verify) {
	// call super constructor
	passport.Strategy.call(this);

	this.name = 'google-oauth-jwt';
	this.options = options || {};
	this._verify = verify;
};

util.inherits(Strategy, passport.Strategy);

var proto = Strategy.prototype;

proto.authenticate = function(req, options) {
	options = options || {};

	var self = this;

	if (req.query && req.query.error) {
		return self.fail();
	}

	// support alias [callbackUrl -> callbackURL]
	var callbackUrl = options.callbackUrl || options.callbackURL || self.options.callbackUrl || self.options.callbackURL;

	// support alias [clientId -> clientID]
	var clientId = options.clientId || options.clientID || self.options.clientId || self.options.clientID;

	if (req.query && req.query.code) {
		request.post({
			url: 'https://www.googleapis.com/oauth2/v3/token',
			form: {
				'code': req.query.code,
				'client_id': clientId,
				'client_secret': options.clientSecret || self.options.clientSecret,
				'redirect_uri': callbackUrl,
				'grant_type': 'authorization_code'
			}
		}, function(err, httpResponse, body) {
			try {
				if (err) {
					return self.error(new Error('failed to obtain access token', err));
				}

				var res = JSON.parse(body);

				// decode JWT
				var info = res.id_token ?
						JSON.parse(new Buffer(res.id_token.split('.')[1], 'base64').toString('utf8')) : null;

				self._verify(res.token, info, res.refresh_token, function verified(err, user, info) {

					if (err) {
						return self.error(err);
					}

					if (!user) {
						return self.fail(info);
					}

					self.success(user, info);
				});
			} catch (e) {
				return self.error(new Error('failed to parse response', err));
			}
		});

	} else {
		/**

			https://developers.google.com/identity/protocols/OAuth2WebServer#formingtheurl

			prepare query string parameters supported by Google Authorization Server for web server application

		**/

		// response_type, redirect_uri, client_id
		var params = {
			'response_type': 'code',
			'redirect_uri': callbackUrl,
			'client_id': clientId
		};

		// scope
		var scope = options.scope || self.options.scope;

		if (scope) {
			if (Array.isArray(scope)) {
				scope = scope.join(self._scopeSeparator);
			}

			params.scope = scope;
		}

		// state
		// access_type
		// approval_prompt
		// login_hint
		// include_granted_scopes
		// hd
		Object.keys(SIMPLE_AUTH_PARAMS).forEach(function(key) {
			var value = options[key] || self.options[key];

			if (value) {
				params[SIMPLE_AUTH_PARAMS[key]] = value;
			}
		});

		var authorizeUrl = url.format({
			protocol: 'https',
			host: 'accounts.google.com',
			pathname: '/o/oauth2/auth',
			query: params
		});

		self.redirect(authorizeUrl);
	}
};
