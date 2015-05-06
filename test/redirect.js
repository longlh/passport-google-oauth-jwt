'use strict';
require('./blanket');
var should = require('should');
var url = require('url');
var urlUtils = require('node-url-utils');
var GoogleStrategy = require('../lib/passport-google-oauth-jwt').GoogleOauthJWTStrategy;

describe('GoogleOauthJWTStrategy redirection', function() {
	it('should redirect to Google OAuth', function(done) {
		var constructOptions = {
			clientId: 'xxx'
		};

		var authenticateOptions = {
			callbackUrl: 'yyy',
			state: 'zzz',
			scope: 'email'
		};

		var expectedAuthorizeUrl = url.format({
			protocol: 'https',
			host: 'accounts.google.com',
			pathname: '/o/oauth2/auth',
			query: {
				client_id: constructOptions.clientId,
				response_type: 'code',
				redirect_uri: authenticateOptions.callbackUrl,
				state: authenticateOptions.state,
				scope: authenticateOptions.scope
			}
		});

		var strategy = new GoogleStrategy(constructOptions);

		// stub redirect method
		strategy.redirect = function(authorizeUrl) {
			should.equal(urlUtils.equals(authorizeUrl, expectedAuthorizeUrl), true);

			done();
		};

		strategy.authenticate({}, authenticateOptions);
	});

	it('should redirect to Google OAuth (aliases)', function(done) {
		var constructOptions = {
			clientID: 'xxx'
		};

		var authenticateOptions = {
			callbackURL: 'yyy',
			state: 'zzz',
			scope: 'email'
		};

		var expectedAuthorizeUrl = url.format({
			protocol: 'https',
			host: 'accounts.google.com',
			pathname: '/o/oauth2/auth',
			query: {
				client_id: constructOptions.clientID,
				response_type: 'code',
				redirect_uri: authenticateOptions.callbackURL,
				state: authenticateOptions.state,
				scope: authenticateOptions.scope
			}
		});

		var strategy = new GoogleStrategy(constructOptions);

		// stub redirect method
		strategy.redirect = function(authorizeUrl) {
			should.equal(urlUtils.equals(authorizeUrl, expectedAuthorizeUrl), true);

			done();
		};

		strategy.authenticate({}, authenticateOptions);
	});

	it('should redirect to Google OAuth (scopes)', function(done) {
		var constructOptions = {
			clientId: 'xxx'
		};

		var authenticateOptions = {
			callbackUrl: 'yyy',
			state: 'zzz',
			scope: [
				'email',
				'profile'
			]
		};

		var expectedAuthorizeUrl = url.format({
			protocol: 'https',
			host: 'accounts.google.com',
			pathname: '/o/oauth2/auth',
			query: {
				client_id: constructOptions.clientId,
				response_type: 'code',
				redirect_uri: authenticateOptions.callbackUrl,
				state: authenticateOptions.state,
				scope: authenticateOptions.scope.join(' ')
			}
		});

		var strategy = new GoogleStrategy(constructOptions);

		// stub redirect method
		strategy.redirect = function(authorizeUrl) {
			should.equal(urlUtils.equals(authorizeUrl, expectedAuthorizeUrl), true);

			done();
		};

		strategy.authenticate({}, authenticateOptions);
	});
});
