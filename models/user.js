'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let createError = require('http-errors');
let jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  curr_courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'cccourses'}],
  univ_credits: {type: Number},
  univ_classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'uwcourses'}],
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

module.exports = mongoose.model('users', userSchema);
