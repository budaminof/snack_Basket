var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");

var dotenv = require('dotenv');
var sendgrid = require('sendgrid')('MatieuB', 'tenbusch7');

var errorArray = [];

router.get('/', function(req, res, next) {
  knex('users')
      .then(function(data) {
        return knex('items')
            .select('name', 'description', 'price', 'image_url', 'id')
            .then(function(items) {
              res.render('admin',{
                name: req.session.passport.user.name,
                data: data,
                items:items
              });
          })
  })
})

router.post('/new', function(req, res, next) {

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
        res.redirect('/admin');
    } else if (req.body.email && req.body.first_name && req.body.last_name && req.body.password && req.body.confirm) {
        knex('users')
            .where({
                email: req.body.email
            })
            .then(function(response) {
                if (response.length > 0) {
                    res.redirect('/users/login', {
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
                            oauth_type: 'bcrypt',
                            admin: req.body.admin
                        })
                        .then(function(id) {
                            //get file
                            var regEmail = fs.readFileSync('./views/email.hbs', 'utf-8');
                            //compile template
                            var compiledTemplate = Handlebars.compile(regEmail);

                            sendgrid.send({
                                to: req.body.email,
                                from: 'noreply@gnosh.com',
                                subject: 'New Admin!',
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
                            res.redirect('/admin');
                        })
                }
            })
    };
})



router.get('/users/:id/edit', function(req, res, next) {
    knex('users')
        .where({
            id: req.params.id
        })
        .first()
        .then(function(data) {
            res.render('admin_users_edit', {
                data: data
            });
        })
})

router.post('/users/:id/edit', function(req, res, next) {
    knex('users')
        .where({
            id: req.params.id
        })
        .update(req.body)
        .then(function(info) {
            res.redirect('/admin');
        })
})


router.get('/products/:id/edit', function(req, res, next) {
    knex('items')
        .where({
            id: req.params.id
        })
        .then(function(data) {
            res.render('admin_products_edit', {
                data: data[0]
            })
        })
})

router.get('/products/:id/edit', function(req, res, next) {
    knex('items')
        .where({
            id: req.params.id
        })
        .update(req.body)
        .then(function(info) {
            res.redirect('/admin');
        })
})

router.get('/products/:id/delete', function(req, res, next) {
    knex('items')
        .where({
            id: req.params.id
        })
        .first()
        .del()
        .then(function(info) {
            res.redirect('/admin');
        })
})


router.post('/products/add', function(req, res, next) {
    knex('items')
        .insert(req.body)
        .returning('id')
        .then(function(id) {
            res.redirect('/admin/products');
        })
})
module.exports = router;
