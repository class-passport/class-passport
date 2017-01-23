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


//this should work in place of the map at the bottom of the next function.... but it doesn't. and I give up.
// let showEquivalents = function(objectArray) {
//   return new Promise((resolve, reject) => {
//     if(!objectArray) return reject(createError(401));
//     let abbrevCourseList = objectArray.map(function(course) {
//       if(course) {
//         return({cccourse: course.ccequiv, uwequiv: course.code});
//       }
//     });
//     resolve(abbrevCourseList);
//   });
// };

router.get('/students/university-equiv', bearerAuth, (req, res, next) => {
  let uwCourseEquivalents = [];
  if(!req.user) return next(createError(401));
  User.findById(req.user._id)
  .populate('curr_courses')
  .exec(function(err, list) {
    let studentCourseList = list.curr_courses;
    //helper function makes an maps an array of only cccourse codes
    list.generateCourseList(studentCourseList)
    .then(courses => {
      //find the uw equivalents to the cc course codes and push them to temp array
      courses.forEach(function(course) {
        uwCourseEquivalents.push(UWcourse.findOne({ccequiv: course}));
      });
      Promise.all(uwCourseEquivalents)
      .then(list => {
        let newList = list.map(function(course) {
          //tried to make this into a promise but was not successful
          if(course) return ({cccourse: course.ccequiv, uwequiv: course.code});
        });
        res.json(newList); //gives direct list of cccourses and their uw equivalents
      });
    });
  })
  .catch(next);
});

//if you want to push your UW course equivalents to the student
router.post('/students/university-equiv', bearerAuth, (req, res, next) => {
  if(!req.user) return next(createError(401));
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
