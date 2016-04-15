var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;

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
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'cookie time',
    keys: [
        process.env.SECRET,
        process.env.SECRET2
    ]
}));


passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.HOST + "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb1) {
        User.findOrCreate(profile, function(err, user) {
            return cb1(null, {
                user_id: user[0].id,
                admin: user[0].admin,
                name: user[0].first_name,
                photo: user[0].image_url
            });
        });
    }
));

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function(email, password, cb) {
    knex('users')
        .where({email: email})
        .first()
        .then(function(user) {
            if (!user) return cb(null, false);
            else if (user && bcrypt.compareSync(password, user.password)) {
                return cb(null, {
                    user_id: user.id,
                    admin: user.admin,
                    name: user.first_name
                });
            } else {
                return cb(null, false);
            }
        });
}))

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/auth/local', passport.authenticate('local'), function(req, res) {

})

app.post('/users/login', passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

app.use(function(req, res, next) {
    if (req.session.passport) {
        res.locals.user = req.session.passport.user;
    }
    next();
});

function userAdmin(req, res, next) {
    if (!req.session.passport.user.admin) return res.redirect('/')
    next();
}
function isloggedIn(req, res, next) {
    if (!req.session.passport) return res.redirect('/');
    next();
}

app.use('/', routes);
app.use(isloggedIn);
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
