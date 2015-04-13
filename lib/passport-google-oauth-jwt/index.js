'use strict';
var https = require('https');
var qs = require('querystring');
var url = require('url');
var util = require('util');
var Strategy = require('passport-strategy');

var SIMPLE_AUTH_PARAMS = {
	state: 'state',
	accessType: 'access_type',
	approvalPrompt: 'approval_prompt',
	loginHint: 'login_hint',
	includeGrantedScopes: 'include_granted_scopes',
	hostedDomain: 'hd'
};

var GoogleOauthJWTStrategy = module.exports.GoogleOauthJWTStrategy = function(options, verify) {
	// call super constructor
	Strategy.call(this);

	this.name = 'google-oauth-jwt';
	this.options = options || {};
	this._verify = verify;
	this._scopeSeparator = ' ';
};

util.inherits(GoogleOauthJWTStrategy, Strategy);

var proto = GoogleOauthJWTStrategy.prototype;

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
		var form = qs.stringify({
			'code': req.query.code,
			'client_id': clientId,
			'client_secret': options.clientSecret || self.options.clientSecret,
			'redirect_uri': callbackUrl,
			'grant_type': 'authorization_code'
		});

		var authRequest = https.request({
			method: 'post',
			hostname: 'www.googleapis.com',
			path: '/oauth2/v3/token',
			port: 443,
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				'content-length': form.length
			}
		}, function(authResponse) {
			authResponse.setEncoding('utf-8');

			var body = '';

			authResponse.on('data', function(chunk) {
				body += chunk;
			});

			authResponse.on('end', function() {
				try {
					var res = JSON.parse(body);

					// decode JWT
					var info = res.id_token ?
							JSON.parse(new Buffer(res.id_token.split('.')[1], 'base64').toString('utf8')) : null;

					self._verify(res.access_token, info, res.refresh_token, function verified(err, user, info) {

						if (err) {
							return self.error(err);
						}

						if (!user) {
							return self.fail(info);
						}

						self.success(user, info);
					});
				} catch (err) {
					return self.error(new Error('failed to parse response', err));
				}
			});
		});

		authRequest.on('error', function(err) {
			self.error(new Error('failed to obtain access token', err));
		});

		authRequest.write(form);

		authRequest.end();
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
