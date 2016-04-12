var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var fs = require('fs');
var Handlebars = require("handlebars");

var dotenv = require('dotenv');
var sendgrid = require('sendgrid')('MatieuB', 'tenbusch7');

/* GET home page. */

router.get('/', function(req, res, next) {
  knex('items')
  .select('name','description','price','image_url')
  .then(function(items) {
    if (!req.session.passport) return res.render('index', { items });
    res.render('index', {
      name: (req.session.passport.user.displayName).split(' ').splice(0, 1).join(' '),
      photo: req.session.passport.user.photo,
      items: items
    });
  })
});

//get file
var regEmail = fs.readFileSync('./views/email.hbs','utf-8');

//compile template
var compiledTemplate = Handlebars.compile(regEmail);

//sendgrid email test
router.get('/email', function(req, res) {
    console.log(compiledTemplate);
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
