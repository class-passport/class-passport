let Course = require('../models/uwcourse');
let createError = require('http-errors');
let bearerAuth = require('../lib/bearer-auth-middleware');

const Router = require('express').Router;

const router = module.exports = new Router();

//Post a new UW course if the user is an admin. Tested manually and seems to work.
router.post('/uwcourse', bearerAuth, (req, res, next) => {
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
router.get('/uwcourse', (req, res) => {
  Course.find({}).then(courses => res.json(courses));
});

  // router.put('/users', bearerAuth, (req, res) => {
  //   if(req.user.admin) {
  //     User.update((req.body), function(err){
  //       if(err) {
  //         res.status(400).end('bad request');
  //       } else {
  //         res.status(200).json({msg: 'updated the user'})
  //       }
  //     });
  //   } else{
  //     if(err) {
  //       console.log(err);
  //       res.status(404).end('not found');
  //     }
  //   }
  // });
  //
  // router.delete('/users', bearerAuth, (req, res) => {
  //   if(req.user) {
  //     delete req.user
  //     .then( () => res.status(204).send())
  //     .catch(err => createError(404, 'Not Found'));
  //   } else {
  //     res.json({msg: 'you are not authorized to delete'})
  //   }
  // });
