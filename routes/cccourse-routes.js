'use strict';
let createError = require('http-errors');
let Router = require('express').Router;

let CCCourse = require('../models/cccourse.js');
let bearerAuth = require('../lib/bearer-auth-middleware.js');


const router = module.exports = new Router();

router.post('/cccourses', bearerAuth, function(req, res, next) {
  CCCourse.save(req.body)
  .then(course => res.json(course))
  .catch(next);

  // CCCourses.find({code: req.body.code})
  // .then( course => res.json(course))
  // .catch(next);
  //res.json(course)
  //student should not be allowed to add a course that is not offered
  //at the CC. In this case res.json({msg: 'course not offered}).
  //if course is offered then add to students course's array
});

router.get('/cccourses', bearerAuth, function(req, res, next) {
  CCCourse.find({})
  .then(courses => res.json(courses))
  .catch(next);
  //res.json(student.courses)
  //should return an array of all the students community college courses
});

router.get('/cccourses/:id', bearerAuth, function(req, res, next) {
  CCCourse.findById(req.student._id)
  .then(course => res.json(course))
  .catch(next);
  //res.json(course)
  //should return one course
});

router.delete('/cccourses', bearerAuth, function(req, res, next) {
  req.user.currCourses = [];
  //res.status(204).end()
  //this deletes all courses in the student's courses array.
  //does not effect cc catalog
});

router.delete('/cccourses/:id', bearerAuth, function(req, res, next) {
  //res.status(204).end()
  //this deletes this specific course from the student's courses array
  CCCourse.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, 'Not Found')));
});
