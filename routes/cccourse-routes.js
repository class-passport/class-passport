'use strict';

// app modules
const Router = require('express').Router;
// const basicAuth = require('../lib/basic-auth-middleware.js');
const CCcourse = require('../models/cccourse.js');

// module constants
const router = module.exports = new Router();

router.post('/cccourse', (req, res) => {
  const course = new CCcourse(req.body);
  course.save()
  .catch(function(err) {
    console.log(err);
  });
  res.json(course);
});
