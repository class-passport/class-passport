'use strict';

// npm modules
const request = require('superagent');

// app modules
const Router = require('express').Router;
const UWCourse = require('../models/uwcourse.js');

const router = module.exports = new Router();
router.get('/uwdata/:subject', (req, res, next) => {
  request.get('https://wseval.s.uw.edu:443/student/v5/course.json?year=2017&quarter=winter&curriculum_abbreviation=' + req.params.subject + '&page_size=5&page_start=6')
    .set('Authorization', 'Bearer ' + process.env.UW_TOKEN)
    .end((err, response) => {

      response.body.Courses.map(ele => {
        return {description: ele.Href, longTitle: ele.CourseTitleLong, code: ele.CurriculumAbbreviation + ' ' + ele.CourseNumber, credits: 5};
      })
      .forEach(ele => {

        request.get('https://wseval.s.uw.edu:443' + ele.description)
          .set('Authorization', 'Bearer ' + process.env.UW_TOKEN)
          .end((err, resp) => {
            ele.description = resp.body.CourseDescription;

            let course = new UWCourse(ele);
            course.save();
          });

      });

      res.json({complete: true});
      next();
    });

});
