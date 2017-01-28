'use strict';

// npm modules
const createError = require('http-errors');
const Router = require('express').Router;

// app modules
const CCCourse = require('../models/cccourse.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module constants
const router = module.exports = new Router();

router.post('/cccourses', bearerAuth, (req, res, next) => {
  if(req.user.admin) {
    const course = new CCCourse(req.body);
    course.save()
      .then(course => res.json(course))
      .catch(next);
  } else {
    CCCourse.findAndAddCourse(req.body.code, req.user)
    .then(user => {
      user.password = null;
      res.json(user);
    })
    .catch(next);
  }
});

router.get('/cccourses', (req, res, next) => {
  CCCourse.find({})
   .then(courses => res.json(courses))
   .catch(next);
});

router.get('/cccourses/:id', (req, res, next) => {
  CCCourse.findById(req.params.id)
    .then(course => {
      res.json(course);

    })
    .catch(next);
});

router.put('/cccourses/:id', bearerAuth, (req, res, next) => {
  if(!req.user.admin) return next(createError(401));

  CCCourse.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(course => res.json(course))
    .catch(next);
});

router.delete('/cccourses/:id', bearerAuth, function(req, res, next) {
  if(req.user.admin) {
    CCCourse.findByIdAndRemove(req.params.id)
      .then(() => res.status(204).end())
      .catch(next);

    return;
  }
  req.user.removeCurrCourse(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});
