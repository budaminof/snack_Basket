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

var amount=0;

var regEmail = fs.readFileSync('./views/email.hbs', 'utf-8');
var compiledTemplate = Handlebars.compile(regEmail);

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
          if(arr.length < 5) {
              arr.unshift('0')
          }
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
    knex('users_addresses')
        .where({user_id:req.session.passport.user.user_id})
        .then(function(data){
            if(data.length == 0) {
                req.session.message = "PLEASE ADD AN ADDRESS!";
                res.redirect('/users/cart');
            } else {
                knex('users')
                    .where({id:req.session.passport.user.user_id})
                    .then(function(data) {
                        var email= data[0].email
                        //get file
                        var confEmail = fs.readFileSync('./views/conf_email.hbs', 'utf-8');
                        //compile template
                        var compiledTemplate = Handlebars.compile(confEmail);
                        console.log(req.session);
                        sendgrid.send({
                            to: email,
                            from: 'noreply@gnosh.com',
                            subject: 'Order confirmation from GNOSH.com',
                            html: compiledTemplate({
                                firstName: req.session.passport.user.name
                            })
                        }, function(err, json) {
                            if (err) {
                                console.log('err',err);
                            }
                            console.log('success!!!', json);
                        })
                        .then(function() {

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
                                    req.session.message = 'Successful payment!';
                                    res.redirect('/users/cart');
                                })
                            });
                        })
               })
        }
    })
})

router.get('/logout', function(req, res, next) {
    req.session = null;
    res.redirect('/');
});

module.exports = router;
