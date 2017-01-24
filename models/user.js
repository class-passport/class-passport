'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let createError = require('http-errors');
let jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  curr_courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'cccourses'}],
  univ_classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'ucourses'}],
  admin: {type: Boolean}
});

userSchema.methods.hashPassword = function(password) {
  if(!password) return Promise.reject(createError(400));

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswords = function(password) {
  return new Promise ((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if(!valid) return reject(createError(401, 'wrong password http error'));
      resolve(this);
    });
  });
};

userSchema.methods.generateToken = function() {
  return new Promise ((resolve, reject) => {
    let token = jwt.sign({id: this._id}, process.env.SECRET || 'DEV');
    if(!token) {
      reject('could not generate token');
    }
    resolve(token);
  });
};

userSchema.methods.removeCurrCourse = function(courseId) {
  const index = this.curr_courses.indexOf(courseId);
  if(index > -1) {
    this.curr_courses.splice(index, 1);
  }

  return this.save()
    .then(user => user);
};

//HELPER FUNCTION FOR GENERATING ARRAY OF COURSE CODES
userSchema.methods.generateCourseList = function(objectArray) {
  return new Promise ((resolve, reject) => {
    if(!objectArray) return reject(createError(400));
    let courseCodeArr = objectArray.map(function(a) {
      return ({code: a.code, equiv: a.uwequiv});
    });
    resolve(courseCodeArr);
  });
};

userSchema.methods.showCourseEquivalents = function(objectArray) {
  return new Promise((resolve, reject) => {
    if(!objectArray) return reject(createError(401));
    let abbrevCourseList = objectArray.map(function(course) {
      if(course) {
        return({cccourse: course.ccequiv, uwequiv: course.code});
      }
    });
    resolve(abbrevCourseList);
  });
};

userSchema.methods.showCourseCredits = function(objectArray) {
  return new Promise((resolve, reject) => {
    if(!objectArray) return reject(createError(401));
    let abbrevCourseList = objectArray.map(function(course) {
      if(course) {
        return({cccourse: course.ccequiv, uw_credits: course.credits});
      }
    });
    let creditsResult = {
      courses: abbrevCourseList,
      total_uw_credits: objectArray.reduce((a, b) => a.credits + b.credits)
    };
    resolve(creditsResult);
  });
};

userSchema.methods.generateCourseIds = function(objectArray) {
  return new Promise ((resolve, reject) => {
    if(!objectArray) return reject(createError(400));
    let courseCodeArr = objectArray.map(function(a) {
      return a._id;
    });
    resolve(courseCodeArr);
  });
};

module.exports = mongoose.model('users', userSchema);
