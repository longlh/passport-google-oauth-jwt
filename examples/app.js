'use strict';

var engine = require('ect');
var express = require('express');
var path = require('path');
var passport = require('passport');
var session = require('express-session');

var GoogleOauthJWTStrategy = require('../lib/passport-google-oauth-jwt').GoogleOauthJWTStrategy;

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = '19650001560-msm738c7mjme3onf25vfu5u83ctuvoaa.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'Y1p5u8rKR6O-cNvVJLk1yM5i';

// config passport
passport.serializeUser(function serialize(user, done) {
	done(null, user);
});

passport.deserializeUser(function deserialize(obj, done) {
	done(null, obj);
});

passport.use(new GoogleOauthJWTStrategy({
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET
}, function verify(token, info, refreshToken, done) {
	done(null, {
		email: info.email
	});
}));

// config express
var app = express();

var ect = engine({
	root: path.resolve(__dirname, 'views')
});

app.engine('ect', ect.render);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ect');

app.use(session({
	secret: 'google-oauth-jwt',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// route
app.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}, function(req, res) {
	res.render('index', {
		user: req.user
	});
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// request google login
app.get('/auth/google', passport.authenticate('google-oauth-jwt', {
	callbackUrl: 'http://localhost:3000/auth/google/callback',
	scope: [
		'email',
		'https://www.googleapis.com/auth/calendar'
	]
}), function(req, res) {
	res.redirect('/');
});

// handle google callback
app.get('/auth/google/callback', passport.authenticate('google-oauth-jwt', {
	callbackUrl: 'http://localhost:3000/auth/google/callback'
}), function(req, res) {
	res.redirect('/');
});

app.listen(3000, function done() {
	console.log('Example site start at :3000');
});
