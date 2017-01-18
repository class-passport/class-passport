'use strict';

let mongoose = require('mongoose');

let ucourseSchema = mongoose.Schema({
  code: {type: String, required: true},
  ccequiv: {type: String, ref: 'cccourses'},
  credits: {type: Number, required: true}
});

module.exports = mongoose.model('ucourses', ucourseSchema);
