'use strict';

// npm modules
const createError = require('http-errors');
const Router = require('express').Router;

// app modules
const Student = require('../models/student.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module constants
const router = module.exports = new Router();

router.get('/students', bearerAuth, (req, res, next) => {
  if(!req.student) return next(createError(401));

  Student.findById(req.student._id)
    .then(student => {
      delete student.password;
      res.json(student);
    })
    .catch(next);
});

router.put('/students', bearerAuth, (req, res, next) => {
  if(!req.student) return next(createError(401));

  Student.findOneAndUpdate({_id: req.student._id}, req.body, {new: true})
    .then(student => {
      delete student.password;
      res.json(student);
    })
    .catch(next);
});

router.delete('/students', bearerAuth, (req, res, next) => {
  if(!req.student) return next(createError(401));

  Student.findByIdAndRemove(req.student._id)
    .then(() => res.status(204).end())
    .catch(next);
});

router.get('/*', (req, res, next) => {
  next(createError(404));
});
