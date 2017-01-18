'use strict';
let createError = require('http-errors');
let Router = require('express').Router;

let CCCourse = require('../models/cccourse.js');
let bearerAuth = require('../lib/bearer-auth-middleware.js');


const router = module.exports = new Router();

router.post('/cccourse', bearerAuth, (req, res) => {
  const course = new CCCourse(req.body);
  course.save()
  .catch(function(err) {
    console.log(err);
  });
  res.json(course);
});

router.get('/cccourses', bearerAuth, function(req, res, next) {
  // returns all courses for both student and admin(if used)
  CCCourse.find({})
  .then(courses => res.json(courses))
  .catch(next);
});

router.put('/cccourses/:id', bearerAuth, function(req, res, next) {
  //ideally only admins would be able to update a course
  CCCourse.findById(req.params.id)
  .then(course => {
    return CCCourse.findByIdAndUpdate(course._id, req.body, {new:true});
  })
  .then(course => res.json(course))
  .catch(next);
});
//
// router.delete('/cccourses', bearerAuth, function(req, res, next) {
//   req.user.currCourses = [];
//   //res.status(204).end()
//   //this deletes all courses in the student's courses array.
//   //does not effect cc catalog
// });
//
router.delete('/cccourses/:id', bearerAuth, function(req, res, next) {
  //deletes a selected course by id
  //ideally only an admin would be able to do this
  CCCourse.findById(req.params.id)
  .then(course => {
    return CCCourse.remove({_id: course._id});
  })
  .then(() => res.status(204).send())
  .catch(err => next(createError(401, 'invalid id')));
});
