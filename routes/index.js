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


router.get('/', function(req, res, next) {
  knex('items')
  .select('name','description','price','image_url','id')
  .then(function(items) {
    if (!req.session.passport) return res.render('index', { items });
    res.render('index', {
        items: items,
        name: req.session.passport.user.name,
        photo: req.session.passport.user.photo
    });
  })
});


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

router.post('/cart/add/:itemId', function (req, res ,next){
    var item = req.params.itemId;
    var user;
    if(!req.session.passport){
     user = req.session.id
        } else{
        user = req.session.passport.user.id;
        }

    knex('users_cart')
    .insert({
        user_id: user,
        item_id: item
    })
    .returning('*')
    .then(function(data){
        console.log(data);
        res.redirect('/');
    })
})

module.exports = router;
