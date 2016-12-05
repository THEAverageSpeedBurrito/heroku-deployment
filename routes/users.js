'use strict';

const express = require('express');
const knex = require('../knex');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(bodyParser.json());

// YOUR CODE HERE

router.post('/', (req, res, next) => {
  var {firstName, lastName, email, password} = req.body;

  bcrypt.hash(password, 5).then((hashed_password) => {

    knex('users').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      hashed_password
    }, '*')
    .then((users) => {
      delete users[0].hashed_password;
      delete users[0].created_at;
      delete users[0].updated_at;
      res.send(camelizeKeys(users[0]));
    });

  });


});

module.exports = router;
