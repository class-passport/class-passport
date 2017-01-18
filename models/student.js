'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let createError = require('http-errors');
let jwt = require('jsonwebtoken');

let studentSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  curr_courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'cccourses'}],
  univ_credits: {type: Number},
  univ_classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'uwcourses'}]
});

studentSchema.methods.hashPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

studentSchema.methods.comparePasswords = function(password) {
  return new Promise ((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if(!valid) return reject(createError(401, 'wrong password http error'));
      resolve(this);
    });
  });
};

studentSchema.methods.generateToken = function() {
  return new Promise ((resolve, reject) => {
    let token = jwt.sign({id: this._id}, process.env.SECRET || 'DEV');
    if(!token) {
      reject('could not generate token');
    }
    resolve(token);
  });
};

studentSchema.methods.removeCurrCourse = function(courseId) {
  const index = this.curr_courses.indexOf(courseId);
  if(index > -1) {
    this.curr_courses.splice(index, 1);
  }

  return this.save()
    .then(student => student);
};

module.exports = mongoose.model('students', studentSchema);
