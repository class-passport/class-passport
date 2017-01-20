'use strict';

let createError = require('http-errors');
let mongoose = require('mongoose');

let cccourseSchema = mongoose.Schema({
  code: {type: String, required: true},
  uwequiv: {type: String, ref:'ucourses'}
});

const CCCourse = module.exports = mongoose.model('cccourses', cccourseSchema);

CCCourse.findAndAddCourse = function(courseCode, user) {
  if(!courseCode) return Promise.reject(createError(400, 'Course Code Required'));

  return CCCourse.findOne({code: courseCode})
    .then(course => {
      if(!course) return Promise.reject(createError(404, 'Course Not Offered'));
      user.curr_courses.push(course._id);
      return user.save();
    })
    .then(user => user);
};
