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
		nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.replyWithError('fake error');

		var strategy = new GoogleStrategy();

		// stub error method
		strategy.error = function() {
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		});
	});

	it('should error because of bad response', function(done) {
		nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(200, {
				id_token: 'xxxx'
			});

		var strategy = new GoogleStrategy();

		// stub error method
		strategy.error = function() {
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		});
	});

	it('should error because of not 200 response code', function(done) {
		nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(500, {
				error: {
					code: 500,
					message: 'Something wrong'
				}
			});

		var strategy = new GoogleStrategy();

		// stub error method
		strategy.error = function() {
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		});
	});

	it('should error because of handling logic', function(done) {
		nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(200, {
				id_token: 'xxx.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ==.xxx'
			});

		var strategy = new GoogleStrategy(null, function(accessToken, loginInfo, refreshToken, verify) {
			verify({});
		});

		// stub error method
		strategy.error = function(err) {
			should.deepEqual(err, {});
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		});
	});

	it('should fail because of handling logic', function(done) {
		nock('https://www.googleapis.com')
			.post('/oauth2/v3/token')
			.reply(200, {
				id_token: 'xxx.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ==.xxx'
			});

		var strategy = new GoogleStrategy(null, function(accessToken, loginInfo, refreshToken, verify) {
			verify(null, null, {});
		});

		// stub info method
		strategy.fail = function(info) {
			should.deepEqual(info, {});
			done();
		};

		strategy.authenticate({
			query: {
				code: 'xxx'
			}
		});
	});

	afterEach(function() {
		nock.cleanAll();
	});
});
