'use strict';

let Course = require('../models/uwcourse');
let createError = require('http-errors');
let bearerAuth = require('../lib/bearer-auth-middleware');

const Router = require('express').Router;

const router = module.exports = new Router();

router.post('/uwcourses', bearerAuth, (req, res, next) => {
  if(!req.user.admin) return next(createError(401));

  const course = new Course(req.body);
  course.save()
    .then(course => res.json(course))
    .catch(next);
});

router.get('/uwcourses', (req, res) => {
  Course.find({}).then(courses => res.json(courses));
});

router.put('/uwcourses/:id', bearerAuth, (req, res, next) => {
  if(!req.user.admin) return next(createError(401));

  Course.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(course => res.json(course))
    .catch(next);
});

router.delete('/uwcourses/:id', bearerAuth, function(req, res, next) {
  if(!req.user.admin) return next(createError(401));

  Course.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
  return;
});
