'use strict';
require('./blanket');
var should = require('should');
var GoogleStrategy = require('../lib/passport-google-oauth-jwt').GoogleOauthJWTStrategy;

describe('GoogleOauthJWTStrategy initialization', function() {
	it('should return GoogleOauthJWTStrategy class', function(done) {
		should.equal(typeof GoogleStrategy, 'function');

		done();
	});

	it('should be named `google-oauth-jwt`', function(done) {
		var strategy = new GoogleStrategy();

		should.equal(strategy.name, 'google-oauth-jwt');

		done();
	});

	it('should initialize empty options', function(done) {
		var strategy = new GoogleStrategy();

		should.deepEqual(strategy.options, {});

		done();
	});

	it('should store options', function(done) {
		var options = {
			clientId: 'xxx',
			clientSecret: 'yyy'
		};

		var strategy = new GoogleStrategy(options);

		should.equal(strategy.options, options);

		done();
	});

	it('_scopeSeparator should be ` `', function(done) {
		var strategy = new GoogleStrategy();

		should.equal(strategy._scopeSeparator, ' ');

		done();
	});
});
