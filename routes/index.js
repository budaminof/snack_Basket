var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");

var dotenv = require('dotenv');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME,process.env.SENDGRID_PASSWORD);

//get file
var regEmail = fs.readFileSync('./views/email.hbs', 'utf-8');
//compile template
var compiledTemplate = Handlebars.compile(regEmail);


function isloggedIn(req, res, next) {
    if (!req.session.passport) return res.redirect('/users/login')
    next();
}

router.get('/', function(req, res, next) {
    knex('items')
        .select('name', 'description', 'price', 'image_url', 'id')
        .then(function(items) {
            if (!req.session.passport) return res.render('index',{items});

            res.render('index', {
                items: items,
                name: req.session.passport.user.name,
                photo: req.session.passport.user.photo
            });
        })
});

router.post('/cart/add/:item_id', isloggedIn, function(req, res, next) {
    knex('users_cart')
        .insert({
            user_id: req.session.passport.user.user_id,
            item_id: req.params.item_id
        })
        .returning('*')
        .then(function(data) {
            res.redirect('/');
        })
})


module.exports = router;
