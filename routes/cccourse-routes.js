'use strict';

// app modules
const Router = require('express').Router;
// const basicAuth = require('../lib/basic-auth-middleware.js');
const CCcourse = require('../models/cccourse.js');

// module constants
const router = module.exports = new Router();

router.post('/cccourses', (req, res) => {
  const course = new CCcourse(req.body);
  course.save()
  .catch(function(err) {
    console.log(err);
  });
  res.json(course);
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
