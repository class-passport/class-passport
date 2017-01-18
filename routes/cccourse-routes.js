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
  // STUDENTS: students req will search course collection and if course
  // is offered (found by code), then push course._id into
  // student.curr_courses array and save changes. If the course is
  // not found then create an error telling user that course is not
  // offered.
  // this should probably be in the PUT route
  CCCourse.findAndAddCourse(req.body.code, req.student)
    .then(student => res.json(student))
    .catch(next);

  // ADMIN: creates new course
  // const course = new CCCourse(req.body);
  // course.save()
  //   .then(course => res.json(course))
  //   .catch(next);
});

router.get('/cccourses', bearerAuth, (req, res, next) => {
  // STUDENT and ADMIN: returns all courses for both student and admin(if used)
  CCCourse.find({})
    .then(courses => res.json(courses))
    .catch(next);
});

router.get('/cccourses/:id', bearerAuth, (req, res, next) => {
  // STUDENT and ADMIN: returns one course for both student and admin(if used)
  CCCourse.findById(req.params.id)
    .then(course => res.json(course))
    .catch(next);
});

router.put('/cccourses/:id', bearerAuth, (req, res, next) => {
  //ADMIN: ideally only admins would be able to update a course
  CCCourse.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(course => res.json(course))
    .catch(next);
});

router.delete('/cccourses/:id', bearerAuth, function(req, res, next) {
  //STUDENT: deletes ($pulls) a selected course from curr_courses by id

  //ADMIN: ideally only an admin would be able to remove a course from collection
  CCCourse.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});

router.get('/cccourses', (req, res) => {
  CCCourse.find({})
    .then(courses => {
      res.write('list of community college courses:' + '\n');
      courses.forEach(function(course) {
        res.write(course.code + '\n');
      });
      res.end();
    });
});
