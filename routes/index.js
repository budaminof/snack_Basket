var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

/* GET home page. */

router.get('/', function(req, res, next) {
  knex.select('name','description','price','image_url').from('items')
  .then(function(items) {
    console.log(items)
    res.render('index', {items });
  })
});

module.exports = router;
