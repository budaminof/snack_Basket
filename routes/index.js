var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);
var dotenv = require('dotenv');
var sendgrid = require('sendgrid')('MatieuB', 'tenbusch7');

/* GET home page. */

router.get('/', function(req, res, next) {
  knex('items')
  .select('name','description','price','image_url','id')
  .then(function(items) {
    if (!req.session.passport) return res.render('index', { items });
    res.render('index', {
      name: (req.session.passport.user.displayName).split(' ').splice(0, 1).join(' '),
      photo: req.session.passport.user.photo,
      items: items
    });
  })
});

//sendgrid email test
router.get('/email', function(req, res) {
    sendgrid.send({
        to: ['bouchard.matthewj@gmail.com'],
        from: 'noreply@gnosh.com',
        subject: 'hello world!',
        text: 'It worked, got the basic emaily functioning! :D'
    }, function(err, json) {
        if(err) {
          res.send('oh no!!');
      } res.send('success!!!!!!!',json);
  })
});

module.exports = router;
