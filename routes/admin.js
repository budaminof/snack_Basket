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
    .returning('id')
    .then(function(id){
        res.redirect('/admin/users');
    })
})

router.get('/users', function (req, res, next){
    knex('users')
    .then(function(data){
        res.render('admin_users', {data: data});
    })
})

router.get('/users/:id/edit', function (req, res, next){
    knex('users')
    .where({id: req.params.id})
    .first()
    .then(function (data){
        res.render('admin_users_edit',{data: data});
    })
})

router.post('/users/:id/edit', function (req, res, next){
    knex('users')
    .where({id: req.params.id})
    .update(req.body)
    .then(function(info){
        res.redirect('/admin/users');
    })
})

router.get('/products', function (req, res, next){
    knex('items')
    .select('name','description','price','image_url', 'id')
    .then(function(items) {
      res.render('admin_products', { items });
    })
})

router.get('/products/:id/edit', function (req, res, next){
    knex('items')
    .where({id: req.params.id})
    .then(function (data){
        res.render('admin_products_edit',{data: data[0]})
    })
})

router.get('/products/:id/edit', function (req, res, next){
    knex('items')
    .where({id: req.params.id})
    .update(req.body)
    .then(function (info){
        res.redirect('/admin/products');
    })
})
module.exports = router;
