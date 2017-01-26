'use strict';

// app modules
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../models/user.js');
const createError = require('http-errors');

// module constants
const router = module.exports = new Router();

router.post('/signup', (req, res, next) => {
  const user = new User(req.body);

  user.hashPassword(user.password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => res.json(token))
    .catch(next);
});

router.get('/login', basicAuth, (req, res, next) => {
  User.findOne({username: req.auth.username})
    .then(user => {
      if(!user) return Promise.reject(next(createError(401)));
      return user.comparePasswords(req.auth.password);
    })
    .then(user => user.generateToken())
    .then(token => res.json(token))
    .catch(next);
});
