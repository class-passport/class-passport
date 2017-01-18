'use strict';

let createError = require('http-errors');
let mongoose = require('mongoose');

let cccourseSchema = mongoose.Schema({
  code: {type: String, required: true}
});

const CCCourse = module.exports = mongoose.model('cccourses', cccourseSchema);

CCCourse.findAndAddCourse = function(courseCode, student) {
  if(!courseCode) return Promise.reject(createError(400, 'Course Code Required'));

  return CCCourse.findOne({code: courseCode})
    .then(course => {
      if(!course) return Promise.reject(createError(404, 'Course Not Offered'));
      student.curr_courses.push(course._id);
      return student.save();
    })
    .then(student => student);
};
