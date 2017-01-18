'use strict';

// npm modules
const Router = require('express').Router;

// app modules
const CCCourse = require('../models/cccourse.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module constants
const router = module.exports = new Router();

router.post('/cccourses', bearerAuth, (req, res, next) => {
  // STUDENTS FUNCTIONALITY: Adds course to curr_courses (PUT?)
  CCCourse.findAndAddCourse(req.body.code, req.student)
    .then(student => res.json(student))
    .catch(next);

  // ADMIN FUNCTIONALITY: Creates New Course
  // const course = new CCCourse(req.body);
  // course.save()
  //   .then(course => res.json(course))
  //   .catch(next);
});

router.get('/cccourses', bearerAuth, (req, res, next) => {
  // STUDENT and ADMIN: Same functionality
  CCCourse.find({})
    .then(courses => res.json(courses))
    .catch(next);
});

router.get('/cccourses/:id', bearerAuth, (req, res, next) => {
  // STUDENT and ADMIN: Same functionality
  CCCourse.findById(req.params.id)
    .then(course => res.json(course))
    .catch(next);
});

router.put('/cccourses/:id', bearerAuth, (req, res, next) => {
  // STUDENT: Not authorized
  // ADMIN: Only admin is permitted to update a course
  CCCourse.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(course => res.json(course))
    .catch(next);
});

router.delete('/cccourses/:id', bearerAuth, function(req, res, next) {
  //STUDENT FUNCTIONALITY: Removes course from curr_courses
  req.student.removeCurrCourse(req.params.id)
    .then(student => res.json(student))
    .catch(next);

  //ADMIN: Removes a course from collection
  // CCCourse.findByIdAndRemove(req.params.id)
  //   .then(() => res.status(204).end())
  //   .catch(next);
});

// router.get('/cccourses', (req, res) => {
//   CCCourse.find({})
//     .then(courses => {
//       res.write('list of community college courses:' + '\n');
//       courses.forEach(function(course) {
//         res.write(course.code + '\n');
//       });
//       res.end();
//     });
// });
