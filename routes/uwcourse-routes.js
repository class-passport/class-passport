let Course = require('../models/uwcourse');
let createError = require('http-errors');
let bearerAuth = require('../lib/bearer-auth-middleware');

const Router = require('express').Router;

const router = module.exports = new Router();

//Post a new UW course if the user is an admin. Tested manually and seems to work.
router.post('/uwcourses', bearerAuth, (req, res, next) => {
  if(!req.user) return next(createError(401));
  if(req.user.admin) {
    const course = new Course(req.body);
    course.save()
      .then(course => res.json(course))
      .catch(next);
  } else {
    return next(createError(401));
  }
});

//Get all UW courses, no authentication needed
router.get('/uwcourses', (req, res) => {
  Course.find({}).then(courses => res.json(courses));
});

router.put('/uwcourses/:id', bearerAuth, (req, res, next) => {
  if(!req.user.admin) return next(createError(401));
  // STUDENT: Not authorized

  // ADMIN: Only admin is permitted to update a course
  Course.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(course => res.json(course))
    .catch(next);
});

router.delete('/uwcourses/:id', bearerAuth, function(req, res, next) {
  if(!req.user.admin) return next(createError(401));
  // STUDENT: Not authorized

    //ADMIN: Removes a course from collection
  Course.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
  return;
});
