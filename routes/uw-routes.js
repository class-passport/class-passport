'use strict';

// app modules
const request = require('superagent');
const Router = require('express').Router;
// const User = require('../models/user.js');
// const createError = require('http-errors');

const router = module.exports = new Router();

router.get('/uwcourses', (req, yes, next) => {
  request.get('https://wseval.s.uw.edu/student/v5/course/2010,autumn,D HYG,401.json')
    .set('Authorization', 'Bearer ' + process.env.UW_TOKEN)
    .end((err, res) => {
      yes.json(res.body);
      next();
    });
});
