'use strict';
require('./blanket');
var nock = require('nock');
var should = require('should');
var GoogleStrategy = require('../lib/passport-google-oauth-jwt').GoogleOauthJWTStrategy;

describe('GoogleOauthJWTStrategy authenticate', function() {
	it('should fail because of bad request', function(done) {
		var strategy = new GoogleStrategy();

		// stub fail method
		strategy.fail = function() {
			done();
		};

		strategy.authenticate({
			query: {
				error: 500
			}
		});
	});

	it('should error because of error response', function(done) {
		var google = nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.replyWithError('fake error');

		var strategy = new GoogleStrategy();

		// stub error method
		strategy.error = function() {
			nock.cleanAll();
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		})
	});

	it('should error because of bad response', function(done) {
		var google = nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(200, {
				id_token: 'xxxx'
			});

		var strategy = new GoogleStrategy();

		// stub error method
		strategy.error = function() {
			nock.cleanAll();
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		})
	});

	it('should error because of handling logic', function(done) {
		var google = nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(200, {
				id_token: 'xxx.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ==.xxx'
			});

		var strategy = new GoogleStrategy(null, function(accessToken, loginInfo, refreshToken, verify) {
			verify({});
		});

		// stub error method
		strategy.error = function(err) {
			nock.cleanAll();
			should.deepEqual(err, {});
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		})
	});

	it('should fail because of handling logic', function(done) {
		var google = nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(200, {
				id_token: 'xxx.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ==.xxx'
			});

		var strategy = new GoogleStrategy(null, function(accessToken, loginInfo, refreshToken, verify) {
			verify(null, null, {});
		});

		// stub info method
		strategy.fail = function(info) {
			nock.cleanAll();
			should.deepEqual(info, {});
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		})
	});
});
