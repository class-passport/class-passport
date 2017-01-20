'use strict';

// npm modules
const createError = require('http-errors');
const Router = require('express').Router;

// app modules
const User = require('../models/user.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module constants
const router = module.exports = new Router();

router.get('/students', bearerAuth, (req, res, next) => {
  if(!req.user) return next(createError(401));
  if(req.user.admin === false) {
    User.findById(req.user._id)
    .then(user => {
      delete user.password;
      res.json(user);
    })
    .catch(next);
  }
  else return next(createError(401));
});

router.get('/students/cccourses', bearerAuth, (req, res, next) => {
  //THIS IS UNTESTED IN ANY WAY AS OF 1/18/2017
  if(!req.user) return next(createError(401));
  User.findById(req.user._id)
    .populate('curr_courses')
    .exec(function(err, courseList) {
      if (err) {
        console.log(err);
        console.log('FIRST ERR');
        return next(createError(401));
      }
      courseList.forEach(function(course) {
        res.write(course);
        res.end();
      });
    })
    .catch(function(err) {
      if(err) {
        console.log('SECOND ERR');
        console.log(err);
        return next(createError(401));
      }
    });
});


router.put('/students', bearerAuth, (req, res, next) => {
  if(!req.user) return next(createError(401));
  if (!req.user.admin === false) {
    User.findOneAndUpdate({_id: req.user._id}, req.body, {new: true})
    .then(user => {
      delete user.password;
      res.json(user);
    })
    .catch(next);
  }
});

router.delete('/students', bearerAuth, (req, res, next) => {
  if(!req.user) return next(createError(401));
  if (!req.user.admin === false) {
    User.findByIdAndRemove(req.user._id)
    .then(() => res.status(204).end())
    .catch(next);
  }
});

router.get('/*', (req, res, next) => {
  next(createError(404));
});
