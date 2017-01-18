let Course = require('../models/uwcourse');
let jsonParser = require('body-parser').json();
let createError = require('http-errors');
let bearerAuth = require('../lib/bearer-auth-middleware')

module.exports = (router) => {

  //Adding a new UW course
  router.post('/uwcourse', bearerAuth, jsonParser, (req, res) => {
    if(req.user) {
      let course = new Course(req.body);
      course.save();
      if(err) {
        res.status(400).end('bad request');
      } else {
        res.status(200).json({msg: 'updated the user'});
      }
      res.json(course);
    } else {
      res.json({msg: 'you are not authorized to add courses to this collection'});
    }
  });

//Get all UW courses
  router.get('/uwcourse', bearerAuth, (req, res) => {
    Course.find({}).then(courses => res.json(courses));
  });
  

  router.put('/users', bearerAuth, jsonParser, (req, res) => {
    if(req.user) {
      User.update((req.body), function(err){
        if(err) {
          res.status(400).end('bad request');
        } else {
          res.status(200).json({msg: 'updated the user'})
        }
      });
    } else{
      if(err) {
        console.log(err);
        res.status(404).end('not found');
      }
    }
  });

  router.delete('/users', bearerAuth, (req, res) => {
    if(req.user) {
      delete req.user
      .then( () => res.status(204).send())
      .catch(err => createError(404, 'Not Found'));
    } else {
      res.json({msg: 'you are not authorized to delete'})
    }
  });
};
