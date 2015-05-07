passport-google-oauth-jwt
=============
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Build Status][travis-image]][travis-url]

[Passport](http://passportjs.org/) strategy for authentication with [Google](http://www.google.com/) that meets the [Migrating to Google Sign-In Guide](https://developers.google.com/identity/sign-in/auth-migration).

The strategy will get access_token, refresh_token and email (with right scopes) of signed-in account by parsing JWT returned from Google OAuth. It does not get full Google profile, but it does not require [Google + API](https://developers.google.com/+/api/auth-migration#sign-in) enabled in [Google Developer's Console](https://console.developers.google.com/). If you want to get a full one, please consider using [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth).

## Install
	$ npm install passport-google-oauth-jwt

## Usage

#### Configurate Strategy

```Javascript
var GoogleStrategy = require('passport-google-oauth-jwt').GoogleOauthJWTStrategy;

passport.use(new GoogleStrategy({
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET
}, function verify(accessToken, loginInfo, refreshToken, done) {
	User.findOrCreate({
		googleEmail: loginInfo.email
	}, function (err, user) {
		return done(err, user);
	});
}));
```

#### Authentication Requests

Use `passport.authentication()`, specifying the `'google-oauth-jwt'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```Javascript
app.get('/auth/google', passport.authenticate('google-oauth-jwt', {
	callbackUrl: 'http://localhost:3000/auth/google/callback',
	scope: 'email'
}));

app.get('/auth/google/callback', passport.authenticate('google-oauth-jwt', {
	callbackUrl: 'http://localhost:3000/auth/google/callback'
}), function onAuthenticate(req, res) {
	// Successful authentication, redirect home
	res.redirect('/');
});
```

## Examples

For a complete, working example, refer to the [example](https://github.com/longlh/passport-google-oauth-jwt/tree/master/examples).

	$ npm install
	$ npm start

## Tests
	$ npm install
	$ npm test

## License

[The MIT License](http://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/passport-google-oauth-jwt.svg?style=flat
[npm-url]: https://www.npmjs.org/package/passport-google-oauth-jwt
[downloads-image]: https://img.shields.io/npm/dm/passport-google-oauth-jwt.svg?style=flat
[coveralls-image]: https://coveralls.io/repos/longlh/passport-google-oauth-jwt/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/longlh/passport-google-oauth-jwt?branch=master
[travis-image]: https://travis-ci.org/longlh/passport-google-oauth-jwt.svg
[travis-url]: https://travis-ci.org/longlh/passport-google-oauth-jwt
