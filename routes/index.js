var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

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

module.exports = router;
