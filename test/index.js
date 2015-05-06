var should = require('should');
var GoogleStrategy = require('../lib/passport-google-oauth-jwt').GoogleOauthJWTStrategy;

describe('GoogleStrategy', function() {
	it('should return GoogleOauthJWTStrategy class', function(done) {
		should(typeof GoogleStrategy).equal('function');

		done();
	});

	it('should be named `google-oauth-jwt`', function(done) {
		var strategy = new GoogleStrategy();

		should(strategy.name).equal('google-oauth-jwt');

		done();
	});

	it('_scopeSeparator should be ` `', function(done) {
		var strategy = new GoogleStrategy();

		should(strategy._scopeSeparator).equal(' ');

		done();
	});
});
