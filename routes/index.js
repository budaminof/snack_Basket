var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.session.passport) return res.render('index');
    res.render('index',{
        name: (req.session.passport.user.displayName).split(' ').splice(0, 1).join(' '),
        photo: req.session.passport.user.photo
    });
});


module.exports = router;
