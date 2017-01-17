'use strict';

// app modules
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const Student = require('../models/student.js');

// module constants
const router = module.exports = new Router();

router.post('/signup', (req, res, next) => {
  const student = new Student(req.body);

  student.hashPassword(student.password)
    .then(student => student.save())
    .then(student => student.generateToken())
    .then(token => res.json(token))
    .catch(next);
});

router.get('/login', basicAuth, (req, res, next) => {
  Student.findOne({name: req.auth.name})
    .then(student => student.comparePasswords(req.auth.password))
    .then(student => student.generateToken())
    .then(token => res.json(token))
    .catch(next);
});
