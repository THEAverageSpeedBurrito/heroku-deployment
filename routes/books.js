'use strict';

const express = require('express');
const knex = require('../knex');
const bodyParser = require('body-parser');
const {camelizeKeys, decamelizeKeys} = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
    knex('books')
    .orderBy('title')
    .then((books) => {
      res.send(camelizeKeys(books));
    }).catch((err) => {
      next(err);
      res.send(err);
    });
});

router.get('/:id', function(req, res, next) {
  var id = parseInt(req.params.id);

  if (Number.isNaN(req.params.id)){
    return next();
  }

  knex('books')
  .where('id', id)
  .then((books) => {
    if(books.length > 0){
      res.send(camelizeKeys(books[0]));
    }else{
      res.sendStatus(404);
    }
  })
  .catch((err) => {
    next(err);
    res.send(err);
  });
});

router.post('/', function(req, res, next) {
  var {title, author, genre, description, coverUrl } = req.body;

  knex('books').insert({
    title,
    genre,
    author,
    description,
    cover_url: coverUrl,
  }, '*').then((books) => {
    res.send(camelizeKeys(books[0]));
  });

});

router.patch('/:id', function(req, res) {
  res.set('Content-Type', 'text/plain');
  if(isNaN(index)){
    res.sendStatus(404);
  }
  var index = parseInt(req.params.id);

  var{title, genre, author, description, coverUrl} = req.body;

  knex('books').update({
    title,
    genre,
    author,
    description,
    cover_url: coverUrl,
  }, '*')
  .where('id', index).then((books) => {
    if(books.length === 0) {
      res.sendStatus(404);
    }
    res.send(camelizeKeys(books[0]));
  })
  .catch((err) => {
    res.send(err);
  });

});

router.delete('/:id', (req, res) => {
  if(isNaN(index)) {
    res.sendStatus(404);
  }
  var index = parseInt(req.params.id);
  var data;

  knex('books')
  .where('id', index)
  .then((books) => {
    if(books.length === 0) {
      res.sendStatus(404);
    }
    data = books;
    delete data[0].id;
    delete data[0].created_at;
    delete data[0].updated_at;
  });

  knex('books')
  .del()
  .where('id', index)
  .then(() => {
    res.send(camelizeKeys(data[0]));
  });
});

//export modules
module.exports = router;
