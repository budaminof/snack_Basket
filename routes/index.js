var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");

var dotenv = require('dotenv');
var sendgrid = require('sendgrid')('MatieuB', 'tenbusch7');
//get file
var regEmail = fs.readFileSync('./views/email.hbs','utf-8');
//compile template
var compiledTemplate = Handlebars.compile(regEmail);


function isloggedIn (req, res, next){
    if(!req.session.passport.user.user_id) return res.redirect('/login')
    next();
}

router.get('/', function(req, res, next) {
    console.log('user_id from passport',req.session.passport.user.user_id);
  knex('items')
  .select('name','description','price','image_url','id')
  .then(function(items) {
    if (!req.session.passport) return res.render('index');

    res.render('index', {
        items: items,
        name: req.session.passport.user.name,
        photo: req.session.passport.user.photo
    });
  })
});

router.post('/cart/add/:item_id', isloggedIn,function (req, res ,next){
console.log('item',req.params.item_id);
console.log('user', req.session.passport.user.user_id);

    knex('users_cart')
    .insert({
        user_id: req.session.passport.user.user_id,
        item_id: req.params.item_id
    })
    .returning('*')
    .then(function(data){
        console.log(data);
        res.redirect('/');
    })
})

//sendgrid email test
router.get('/email', function(req, res) {
    sendgrid.send({
        to: ['bouchard.matthewj@gmail.com'],
        from: 'noreply@gnosh.com',
        subject: 'Welcome from GNOSH.com',
        html: compiledTemplate({firstName:'Matthew, Bud and & Daniel!!!'})
    }, function(err, json) {
        if(err) {
          res.send('oh no!!');
      } res.send('success!!!!!!!',json);
  })
});
//test render rich html email
router.get('/preview', function(req,res){
    res.render('email',{firstName:'Bud'})

})


module.exports = router;
