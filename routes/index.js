var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");
var bcrypt = require('bcrypt');

var dotenv = require('dotenv');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME,process.env.SENDGRID_PASSWORD);


router.get('/', function(req, res, next) {
    knex('items')
        .select('name', 'description', 'price', 'image_url', 'id')
        .then(function(items) {
            if (!req.session.passport) return res.render('index',{items});
              res.render('index', {
                items: items,
                admin: req.session.passport.user.admin,
                name: req.session.passport.user.name,
                photo: req.session.passport.user.photo
              });
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
        res.redirect('/');
    } else {
        knex('users')
            .where({
                email: req.body.email
            })
            .then(function(response) {
                if (response.length > 0) {
                    res.redirect('/');
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


router.get('/products', function(req, res, nex){
  knex('items')
      .select('name', 'description', 'price', 'image_url', 'id')
      .then(function(items) {
          if (!req.session.passport){
               res.render('products',{items: items});
           } else {
               res.render('products', {
                   items: items,
                   name: req.session.passport.user.name,
                   photo: req.session.passport.user.photo
               });
           }
      });
});

router.get('/product/:id', function(req, res, nex){
  knex('items')
  .where({id:req.params.id})
  .select('name', 'description', 'price', 'image_url', 'id')
  .then(function(item) {
    res.render('product',{item:item[0]});
  });
})

module.exports = router;
