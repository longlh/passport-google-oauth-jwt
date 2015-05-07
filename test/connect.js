'use strict';
require('./blanket');
var nock = require('nock');
var should = require('should');
var GoogleStrategy = require('../lib/passport-google-oauth-jwt').GoogleOauthJWTStrategy;

describe('GoogleOauthJWTStrategy authenticate', function() {
	it('should succeed', function(done) {
		nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(200, {
				access_token: 'yyy',
				id_token: 'xxx.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ==.xxx'
			});

		var strategy = new GoogleStrategy(null, function(accessToken, loginInfo, refreshToken, verify) {
			should.equal(accessToken, 'yyy');
			should.equal(loginInfo.email, 'test@example.com');

			verify(null, {
				email: loginInfo.email
			});
		});

		strategy.success = function(user, info) {
			should.deepEqual(user, {
				email: 'test@example.com'
			});

			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		});
	});

	after(function() {
		nock.cleanAll();
	});
});
