'use strict';

// res.cookie('<cookie_name>', <cookie_value>, { cookie_options }); -- creates the cookie w/ values
// req.cookies.<cookie_name>; -- gets that cookie w/ name
// res.clearCookie('<cookie_name>'); - deletes cookie w/ name

const express = require('express');
const bodyParser = require('body-parser');
const knex = require('../knex');
const {camelizeKeys, decamelizeKeys} = require('humps');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(bodyParser.json());
// YOUR CODE HERE
var token = false;

router.get('/', (req, res) => {
    if (token) {
        res.send(true);
    } else {
        res.send(false);
    }
});

router.post('/', (req, res) => {
  res.set('Content-Type', 'text/plain');

    var {email, password} = req.body;

    if (email && password) {
        knex('users').where('email', email).then((user) => {
            if (user.length === 0) {
              res.status(400).send('Bad email or password');
            } else {
                if(bcrypt.compareSync(password, user[0].hashed_password)){
                  token = true;
                  var jwToken = jwt.sign({firstName: user[0].namefirstName, lastName: user[0].lastName}, 'shhhhhh');

                  res.cookie('token', jwToken, {path: '/', httpOnly: true});

                  delete user[0].hashed_password;
                  delete user[0].created_at;
                  delete user[0].updated_at;
                  res.set('Content-Type', 'application/json');
                  res.send(camelizeKeys(user[0]));
                }else{
                  res.status(400).send('Bad email or password');
                }
            }
        });
    } else {
        res.send('Invalid login parameters');
    }
});

router.delete('/', (req, res) => {
  token = false;
  res.clearCookie('token');
  res.send(true);
});

module.exports = router;
