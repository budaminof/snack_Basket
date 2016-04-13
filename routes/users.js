var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");

var dotenv = require('dotenv');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME,process.env.SENDGRID_PASSWORD);

dotenv.load();

router.get('/', function(req, res, next) {});

router.get('/signup', function(req, res, next) {
    res.render('signup');
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'gnosh'
    })
});

router.post('/signup', function(req, res, next) {
    var errorArray = [];

    if (!req.body.email) {
        errorArray.push('Please enter an email');
    }
    if (!req.body.first_name) {
        errorArray.push('Please enter a first name');
    }
    if (!req.body.last_name) {
        errorArray.push('Please enter a last name');
    }
    if (!req.body.password) {
        errorArray.push('Please enter a password');
    }
    if (!req.body.confirm) {
        errorArray.push('Please confirm password');
    }

    if (errorArray.length > 0) {
        res.render('signup', {
            errors: errorArray
        });
    } else if (req.body.email && req.body.first_name && req.body.last_name && req.body.password && req.body.confirm) {
        knex('users')
            .where({
                email: req.body.email
            })
            .then(function(response) {
                if (response.length > 0) {
                    res.render('signup', {
                        error: 'An account with that email already exists'
                    });
                } else {
                    var hash = bcrypt.hashSync(req.body.password, 8);
                    knex('users')
                        .insert({
                            email: req.body.email,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            password: hash,
                            oauth_type: 'bcrypt'
                        })
                        .then(function() {
                            //get file
                            var regEmail = fs.readFileSync('./views/email.hbs', 'utf-8');
                            //compile template
                            var compiledTemplate = Handlebars.compile(regEmail);

                            sendgrid.send({
                                to: req.body.email,
                                from: 'noreply@gnosh.com',
                                subject: 'Welcome from GNOSH.com',
                                html: compiledTemplate({
                                    firstName: req.body.first_name
                                })
                            }, function(err, json) {
                                if (err) {
                                    console.log('oh no!');
                                }
                                console.log('success!!!', json);
                            })

                        }).then(function() {
                            res.redirect('/');
                      })
                }
            })

    };
});

router.get('/logout', function(req, res, next) {
    req.session = null;
    res.redirect('/');
});

module.exports = router;
