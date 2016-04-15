var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");
var stripe = require("stripe")(process.env.TEST_SECRET_KEY);
var stripeToken;

var dotenv = require('dotenv');
dotenv.load();
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME,process.env.SENDGRID_PASSWORD);
var regEmail = fs.readFileSync('./views/email.hbs', 'utf-8');
var compiledTemplate = Handlebars.compile(regEmail);

var amount = 0;

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
    } else {
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

router.post('/cart/add/:item_id', function(req, res, next) {
    knex('users_cart')
        .insert({
            user_id: req.session.passport.user.user_id,
            item_id: req.params.item_id,
            paid: 'false'
        })
        .returning('*')
        .then(function(data) {
            res.redirect('/products');
        })
})

router.get('/cart',function(req, res,next){
  knex('users_cart')
  .where({user_id: req.session.passport.user.user_id, paid: 'false'})
  .innerJoin('items', 'users_cart.item_id', 'items.id')
  .then(function(data){

      return knex('users')
      .where({id: req.session.passport.user.user_id})
      .then(function(user){
          var toPay= 0;

          for (var i = 0; i < data.length; i++) {
            toPay += Number(data[i].price);
          }
          toPay= toPay.toFixed(2);
          var arr = toPay.split('');
          arr.splice(2,1);
          amount = Number(arr.join(''));
          amount += amount * 0.08;

        res.render('cart',{
        name: req.session.passport.user.name,
        photo: req.session.passport.user.photo,
        data: data,
        user: req.session.passport.user.user_id,
        msg: req.session.message,
        key: process.env.TEST_SECRET_KEY,
        amount: amount
        });
        req.session.message= null;
    })
  })
})

router.get('/cart/:id/delete',function(req, res, next){
  knex('users_cart')
  .where({
    user_id: req.session.passport.user.user_id,
    item_id: req.params.id
  })
  .first()
  .del()
  .then(function(data){
    res.redirect('/users/cart');
  })
})

router.post('/address/:id', function(req, res, nex) {
    knex('addresses')
        .insert(req.body)
        .returning('id')
        .then(function(data){
            return  knex('users_addresses')
                .insert({
                  user_id:req.session.passport.user.user_id,
                  address_id :data[0]
                })
                .then(function(info){
                    res.redirect('/users/cart');
                })
        })
})

router.post('/cart/payment', function(req,res, next){
  stripeToken = req.body.stripeToken;

  var charge = stripe.charges.create({
  amount: amount,
  currency: "usd",
  source: stripeToken,
  description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      res.redirect('/users/cart')
    }

    knex('users_cart')
    .where({user_id: req.session.passport.user.user_id})
    .update({paid: 'true'})
    .then(function(items){
        req.session.message = 'Successful payment!'
        res.redirect('/users/cart');
    })
  });

})

router.get('/logout', function(req, res, next) {
    req.session = null;
    res.redirect('/');
});

module.exports = router;
