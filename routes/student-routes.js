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
  if(!req.user) return next(createError(401));
  if(!req.user.admin) {
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
  //Returns the courses a student is taking
  if(!req.user) return next(createError(401));
  User.findById(req.user._id)
  .populate('curr_courses')
  .exec(function(err, list) {
    res.json(list.curr_courses);
  })
  .catch(next);
});


//this will look different, will likely use reduce to add credits
// let generateUwCredits = function(objectArray) {
//   return new Promise ((resolve, reject) => {
//     if(!objectArray) return reject(createError(400));
//     objectArray.map(function(a) {
//       resolve(a.credits);
//     });
//   });
// };

//compares a student's community college classes and checks the uw course list to see if the there is an equivalent, then prints off the info of the uw equivalents that it finds.
router.get('/students/classcompare', bearerAuth, (req, res, next) => {
  let uwCourseEquivalents = [];
  if(!req.user) return next(createError(401));
  User.findById(req.user._id)
  .populate('curr_courses')
  .exec(function(err, list) {
    let studentCourseList = list.curr_courses;
    list.generateCourseList(studentCourseList)
    .then(courses => {
      courses.forEach(function(course) {
        uwCourseEquivalents.push(UWcourse.find({ccequiv: course}));
      });
      Promise.all(uwCourseEquivalents)
      .then(list => {
        res.json(list);
      });
    });
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
  if(req.user.admin) return next(createError(401));
  User.findByIdAndRemove(req.user._id)
  .then(() => res.status(204).end())
  .catch(next);
});
