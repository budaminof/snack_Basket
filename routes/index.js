var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'gnosh' });
});


module.exports = router;
