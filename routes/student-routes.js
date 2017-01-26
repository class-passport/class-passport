'use strict';

// npm modules
const createError = require('http-errors');
const Router = require('express').Router;
const UWcourse = require('../models/uwcourse');

// app modules
const User = require('../models/user.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module constants
const router = module.exports = new Router();

router.get('/students', bearerAuth, (req, res, next) => {
  if(req.user.admin) return next(createError(401));

  User.findById(req.user._id)
  .then(user => {
    user.password = null;
    res.json(user);
  })
  .catch(next);
});

router.get('/students/cccourses', bearerAuth, (req, res, next) => {
  if(req.user.admin) return next(createError(401));

  //Returns the courses a student is taking
  User.findById(req.user._id)
  .populate('curr_courses')
  .exec(function(err, list) {
    res.json({currCourses: list.curr_courses});
  })
  .catch(next);
});

router.get('/students/university-equiv/credits', bearerAuth, (req, res, next) => {
  if(req.user.admin) return next(createError(401));

  let uwCourseEquivalents = [];
  User.findById(req.user._id)
  .populate('curr_courses')
  .exec(function(err, list) {
    let studentCourseList = list.curr_courses;
    //helper function makes an maps an array of only cccourse codes
    list.generateCourseList(studentCourseList)
    .then(courses => {
      //find the uw equivalents to the cc course codes and push them to temp array
      courses.forEach(function(course) {
        if(course.equiv){
          uwCourseEquivalents.push(UWcourse.findOne({ccequiv: course.code}));
        }
      });
      Promise.all(uwCourseEquivalents)
      .then(list => {
        req.user.showCourseCredits(list)
        .then(results => {
          res.json(results);
        });
      });
    });
  })
  .catch(next);
});

router.get('/students/university-equiv', bearerAuth, (req, res, next) => {
  if(req.user.admin) return next(createError(401));

  let uwCourseEquivalents = [];

  User.findById(req.user._id)
  .populate('curr_courses')
  .exec(function(err, list) {
    let studentCourseList = list.curr_courses;
    //helper function makes an maps an array of only cccourse codes
    list.generateCourseList(studentCourseList)
    .then(courses => {
      //find the uw equivalents to the cc course codes and push them to temp array
      courses.forEach(function(course) {
        if(course.equiv) {
          uwCourseEquivalents.push(UWcourse.findOne({ccequiv: course.code}));
        }
      });
      Promise.all(uwCourseEquivalents)
      .then(list => {
        req.user.showCourseEquivalents(list)
        .then(results => {
          res.json(results);
        });
      });
    });
  })
  .catch(next);
});

//if you want to push your UW course equivalents to the student
router.post('/students/university-equiv', bearerAuth, (req, res, next) => {
  if(req.user.admin) return next(createError(401));

  User.findById(req.user._id)
  .populate('curr_courses')
  .exec(function(err, user) {
    //creates new array of uw course equivalents to the user's cc courses
    let promises = user.curr_courses.map(course => {
      return UWcourse.findOne({ccequiv: course.code});
    });
    Promise.all(promises)
      .then(uwCourses => {
        //this list has too much detail! code below pares it down and pushes IDs to user profile where they will persist.
        uwCourses.forEach((uwCourse, index) => {
          user.curr_courses[index].uwequiv = uwCourse;
          if(uwCourse) {
            req.user.univ_classes.push(uwCourse);
          }
        });
        req.user.save();
        res.json(user);
      });
  });
});

router.put('/students', bearerAuth, (req, res, next) => {
  if(req.user.admin) return next(createError(401));

  if(req.body.hasOwnProperty('admin') || req.body.hasOwnProperty('curr_courses') || req.body.hasOwnProperty('univ_classes')) return next(createError(400, 'some of these properties are not able to be updated'));

  User.findOneAndUpdate({_id: req.user._id}, req.body, {new: true})
  .then(user => {
    user.password = null;
    res.json(user);
  })
  .catch(next);
});

router.delete('/students', bearerAuth, (req, res, next) => {
  if(req.user.admin) return next(createError(401));

  User.findByIdAndRemove(req.user._id)
  .then(() => res.status(204).end())
  .catch(next);
});
