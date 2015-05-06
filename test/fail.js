require('./blanket');
var should = require('should');
var GoogleStrategy = require('../lib/passport-google-oauth-jwt').GoogleOauthJWTStrategy;

describe('GoogleOauthJWTStrategy authenticate', function() {
	it('should fail', function(done) {
		var strategy = new GoogleStrategy();

		// stub fail method
		strategy.fail = function() {
			done();
		};

		strategy.authenticate({
			query: {
				error: '500'
			}
		});
	});
});
