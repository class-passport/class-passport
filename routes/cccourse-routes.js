'use strict';

let Router = require('express').Router;

let CCcourse = require('../models/cccourse.js');
let bearerAuth = require('../lib/bearer-auth-middleware.js');


const router = module.exports = new Router();

router.post('/cccourses', bearerAuth, (req, res, next) => {
  // STUDENTS: students req will search course collection and if course
  // is offered (found by code), then push course._id into
  // student.curr_courses array and save changes. If the course is
  // not found then create an error telling user that course is not
  // offered.

  // ADMIN: creates new course
  const course = new CCcourse(req.body);
  course.save()
  .then(course => res.json(course))
  .catch(next);
});

router.get('/cccourses', bearerAuth, (req, res, next) => {
  // STUDENT and ADMIN: returns all courses for both student and admin(if used)
  CCcourse.find({})
  .then(courses => res.json(courses))
  .catch(next);
});

router.put('/cccourses/:id', bearerAuth, (req, res, next) => {
  //ADMIN: ideally only admins would be able to update a course
  CCcourse.findByIdAndUpdate(req.params._id, req.body, {new:true})
  .then(course => res.json(course))
  .catch(next);
});


router.delete('/cccourses/:id', bearerAuth, function(req, res, next) {
  //STUDENT: deletes ($pulls) a selected course from curr_courses by id

  //ADMIN: ideally only an admin would be able to remove a course from collection
  CCcourse.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).end())
  .catch(next);
});

router.get('/cccourses', (req, res) => {
  CCcourse.find({})
  .then(courses => {
    res.write('list of community college courses:' + '\n');
    courses.forEach(function(course) {
      res.write(course.code + '\n');
    });
    res.end();
  });
});
