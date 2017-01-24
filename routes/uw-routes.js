// 'use strict';
//
// // app modules
// const request = require('superagent');
// const Router = require('express').Router;
//
// const mongoose = require('mongoose');
//
// const uwcourseSchema = mongoose.Schema({
//   Href: {type: String, required: true},
//   CourseTitleLong: {type: String, required: true},
//   CourseCode: {type: String, required: true},
// });
//
// const UWCourse = mongoose.model('uwcourse', uwcourseSchema);
//
//
// const router = module.exports = new Router();
// router.get('/uwcourses', (req, res, next) => {
//   request.get('https://wseval.s.uw.edu:443/student/v5/course.json?year=2017&quarter=winter&curriculum_abbreviation=chem')
//     .set('Authorization', 'Bearer ' + process.env.UW_TOKEN)
//     .end((err, response) => {
//       let courses = [];
//
//       response.body.Courses.map(ele => {
//         return {Href: ele.Href, CourseTitleLong: ele.CourseTitleLong, CourseCode: ele.CurriculumAbbreviation + ' ' + ele.CourseNumber};
//       })
//       .forEach(ele => {
//         let course = new UWCourse(ele);
//         courses.push(course);
//         course.save();
//       });
//       res.json(courses);
//       next();
//     });
// });
