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
  if(!req.user) return next(createError(401));

  // ADMIN FUNCTIONALITY: Creates New Course
  if(req.user.admin) {
    const course = new CCCourse(req.body);
    course.save()
      .then(course => res.json(course))
      .catch(next);
  } else {
    CCCourse.findAndAddCourse(req.body.code, req.user)
    .then(user => res.json(user))
    .catch(next);
  }
});



// STUDENT, ADMIN, UNAUTHENTICATED: Same functionality
router.get('/cccourses', (req, res, next) => {
  CCCourse.find({})
   .then(courses => {
     courses.forEach(function(course) {
       res.write(course + '\n');
     });
     res.end();
   })
  .catch(next);
});

router.get('/cccourses/:id', (req, res, next) => {
  // STUDENT, ADMIN, UNAUTHENTICATED: Same functionality
  CCCourse.findById(req.params.id)
    .then(course => res.json(course))
    .catch(next);
});

router.put('/cccourses/:id', bearerAuth, (req, res, next) => {
  if(!req.student) return next(createError(401));

  // STUDENT: Not authorized
  // ADMIN: Only admin is permitted to update a course
  CCCourse.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(course => res.json(course))
    .catch(next);
});

router.delete('/cccourses/:id', bearerAuth, function(req, res, next) {
  if(!req.student) return next(createError(401));

  //STUDENT FUNCTIONALITY: Removes course from curr_courses
  req.student.removeCurrCourse(req.params.id)
    .then(student => res.json(student))
    .catch(next);

  //ADMIN: Removes a course from collection
  // CCCourse.findByIdAndRemove(req.params.id)
  //   .then(() => res.status(204).end())
  //   .catch(next);
});
