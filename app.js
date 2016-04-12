var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var cookieSession = require('cookie-session');
var User = require('./routes/oauth/oauth_init')
var knex = require('knex')(require('./knexfile')[process.env.DB_ENV]);

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();
require('dotenv').load();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'cookie time',
    keys: [
        process.env.SECRET,
        process.env.SECRET2
    ]
}
));


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST+"/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate( profile, function (err, user) {
      return cb(null, {
          oauth_id: profile.id,
          displayName: profile.displayName,
          photo: profile.photos[0].value,
          email: JSON.parse(profile._raw).emails[0].value
      });
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email']}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.use(function (req, res, next) {
    if(req.session.passport) {
        res.locals.user = req.session.passport.user;
    }
  next();
  });

function userAdmin(req, res, next){

    if(!req.session.passport){
        knex('users')
        .where({email: req.session.email})
        .then(function(data){
            if(!data[0].admin) return res.redirect('/users/login');
        })
        next();
    }
    else {
        knex('users')
        .where({email: req.session.passport.user.email})
        .then(function(user){
            if(!user[0].admin) return res.redirect('/users/login');
        })
        next();
    }

 }

app.use('/', routes);
app.use('/users', users);
app.use(userAdmin)
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
