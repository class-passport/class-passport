'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let createError = require('http-errors');

const studentSchema = Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  currCourses: [{type: Schema.Types.ObjectId, ref: 'course'}]
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

studentSchema.methods.comparePasswords = function(plainTextPass) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainTextPass, this.password, (err, result) => {
      if (err) return reject(err);
      if (!result) return reject(createError(401, 'Wrong Password'));
      resolve(this);
    });
  });
};

studentSchema.methods.generateToken = function() {
  return Promise.resolve(jwt.sign({id: this._id}, process.env.SECRET || 'DEV'));
};

module.exports = mongoose.model('student', studentSchema);
