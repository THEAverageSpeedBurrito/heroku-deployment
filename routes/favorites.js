'use strict';

// .join('<table>', 'wherethis', 'equalsthis');

const express = require('express');
const knex = require('../knex');
const bodyParser = require('body-parser');
const {camelizeKeys, decamelizeKeys} = require('humps');
const cookieParser = require('cookie-parser');

// eslint-disable-next-line new-cap
const router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());

// YOUR CODE HERE
router.get('/', (req, res) => {
  knex('favorites').join('books', 'favorites.book_id', 'books.id').then((data) => {
    res.send(camelizeKeys(data));
  });
});

router.get('/check?', (req, res) => {
  var bookId = req.query['bookId'];

  knex('favorites').where('book_id', bookId).then((data) => {
    if(data.length > 0) {
      res.send(true);
    }else{
      res.send(false);
    }
  });
});

router.post('/', (req, res) => {
  var bookId = req.body.bookId;
  knex('favorites').insert({
    book_id: bookId,
    user_id: 1,
  }, '*').then((confirmation) => {
    delete confirmation[0].created_at;
    delete confirmation[0].updated_at;
    res.send(camelizeKeys(confirmation[0]));
  });
});

router.delete('/', (req, res) => {
  var bookId = req.body.bookId;

  var tbd;
  knex('favorites').where('book_id', bookId).then((data) => {
    if(data.length > 0){
      tbd = data;
    }else{
      res.send('No Books found');
    }
  });

  knex('favorites').del().where('book_id', bookId).then(() => {

    if(tbd.length > 0){
      delete tbd[0].created_at;
      delete tbd[0].updated_at;
      delete tbd[0].id;

      res.set('Content-Type', 'application/json');
      res.send(camelizeKeys(tbd[0]));
    }

  });

});

module.exports = router;
