var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");

var dotenv = require('dotenv');
var sendgrid = require('sendgrid')('MatieuB', 'tenbusch7');

var errorArray = [];
var msg = '';

router.get('/', function(req, res, next) {
  knex('users')
      .then(function(data) {
        return knex('items')
            .select('name', 'description', 'price', 'image_url', 'id')
            .then(function(items) {
              res.render('admin',{
                name: req.session.passport.user.name,
                data: data,
                items:items,
                errors:errorArray,
                msg: msg
              });
              errorArray=[];
              msg='';
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
    } else {
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
                            var regEmail = fs.readFileSync('./views/email.hbs', 'utf-8');
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
                            msg = 'A user was added successfuly!'
                            res.redirect('/admin');
                        })
                }
            })
    };
})

router.post('/products/add', function(req, res, next) {
  if (!req.body.name) {
      errorArray.push('Please enter a product name');
  }
  if (!req.body.description) {
      errorArray.push('Don\'t you think that a description is necessary?');
  }
  if (!req.body.image_url) {
      errorArray.push('You want to have here a good looking image..');
  }

  if (errorArray.length > 0){
    res.redirect('/admin');
  }
  else {
    knex('items')
    .insert(req.body)
    .returning('id')
    .then(function(id) {
      msg = 'Product added successfuly!';
      res.redirect('/admin');
    })
  }
})

router.post('/users/:id/edit', function(req, res, next) {

      if (!req.body.email) {
          errorArray.push('Please enter an email');
      }
      if (!req.body.first_name) {
          errorArray.push('Please enter a first name');
      }
      if (!req.body.last_name) {
          errorArray.push('Please enter a last name');
      } 

      if (errorArray.length > 0) {
          res.redirect('/admin');
      } else{
        knex('users')
        .where({
          id: req.params.id
        })
        .update(req.body)
        .then(function(info) {
          msg = 'User was successfuly edited!'
          res.redirect('/admin');
        })
      }
})

router.get('/users/:id/delete', function(req, res, next) {
    knex('users')
        .where({
            id: req.params.id
        })
        .first()
        .del()
        .then(function(info) {
          msg='User was successfuly deleted!'
            res.redirect('/admin');
        })
})

router.post('/products/:id/edit', function(req, res, next) {
  if (!req.body.name) {
      errorArray.push('Please enter a product name');
  }
  if (!req.body.description) {
      errorArray.push('Don\'t you think that a description is necessary?');
  }
  if (!req.body.image_url) {
      errorArray.push('You want to have here a good looking image..');
  }

  if (errorArray.length > 0){
    res.redirect('/admin');
  }
  else{
    knex('items')
    .where({
      id: req.params.id
    })
    .update(req.body)
    .then(function(info) {
      msg='Product was successfuly updated!'
      res.redirect('/admin');
    })
  }
})

router.get('/products/:id/delete', function(req, res, next) {
    knex('items')
        .where({id: req.params.id})
        .first()
        .del()
        .then(function(info) {
          msg='Product was successfuly deleted!'
            res.redirect('/admin');
        })
})

module.exports = router;
