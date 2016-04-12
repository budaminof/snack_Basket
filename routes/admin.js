var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

router.get('/', function (req, res, next){
    res.render('admin');
})

router.get('/new', function (req, res, next){
    res.render('admin_new');
})

router.post('/new', function (req, res, next){
    knex('users')
    .insert(req.body)
})

module.exports = router;
